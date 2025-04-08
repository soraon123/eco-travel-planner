"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Send, LogOut, Info, MapPin, Leaf, AlertTriangle } from "lucide-react"
import { DestinationCard } from "@/components/destination-card"
import { getDestinationImage } from "@/lib/image-service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FirebaseSetupGuide } from "@/components/firebase-setup-guide"
import { FirestoreIndexGuide } from "@/components/firestore-index-guide"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { isFirebaseInitialized, isFirestoreInitialized, getFirebaseAuth, getFirebaseDb } from "@/lib/firebase"

type Message = {
  id?: string
  content: string
  role: "user" | "assistant"
  timestamp?: any
  userId?: string
}

type Destination = {
  name: string
  description: string
  imageUrl: string
}

export default function ChatPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [destination, setDestination] = useState<Destination | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [indexUrl, setIndexUrl] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const [isFirebaseReady, setIsFirebaseReady] = useState(false)
  const [isDbAvailable, setIsDbAvailable] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [isInitialized, setIsInitialized] = useState(false)
  const [isMobileDestinationOpen, setIsMobileDestinationOpen] = useState(false)

  // Check if Firebase is initialized
  useEffect(() => {
    const checkFirebase = () => {
      if (isFirebaseInitialized()) {
        setIsFirebaseReady(true)

        // Check if Firestore is available
        if (isFirestoreInitialized()) {
          setIsDbAvailable(true)
        }

        return true
      }
      return false
    }

    // Check immediately
    if (checkFirebase()) return

    // If not ready, set up an interval to check
    const interval = setInterval(() => {
      if (checkFirebase()) {
        clearInterval(interval)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [])

  // Check authentication status
  useEffect(() => {
    if (!isFirebaseReady) return

    const checkAuth = async () => {
      try {
        const auth = getFirebaseAuth()
        if (!auth) {
          console.error("Auth is not available")
          return () => {}
        }

        return auth.onAuthStateChanged((user: any) => {
          if (user) {
            setUser(user)
            setIsInitialized(true)
          } else {
            router.push("/login")
          }
        })
      } catch (error) {
        console.error("Error checking auth state:", error)
        return () => {}
      }
    }

    const unsubscribe = checkAuth()

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe()
      }
    }
  }, [router, isFirebaseReady])

  // Load chat history from Firestore
  useEffect(() => {
    if (!user || !isInitialized || !isFirebaseReady || !isDbAvailable) return

    const db = getFirebaseDb()
    if (!db) {
      console.error("Firestore is not available")
      setError("Database service is not available. Chat history will not be saved.")
      return
    }

    try {
      // First, check if the messages collection exists and if we can access it
      const setupFirestore = async () => {
        try {
          const messagesRef = db.collection("messages")

          // Try a simple query first without ordering to check basic access
          const simpleQuery = messagesRef.where("userId", "==", user.uid).limit(1)

          try {
            await simpleQuery.get()

            // If we get here, we have basic access to the messages collection
            // Now try the more complex query that requires an index
            try {
              const complexQuery = messagesRef.where("userId", "==", user.uid).orderBy("timestamp", "asc")

              const querySnapshot = await complexQuery.get()

              // If we get here, the index exists
              const loadedMessages: Message[] = []
              querySnapshot.forEach((doc: any) => {
                loadedMessages.push({ id: doc.id, ...doc.data() } as Message)
              })

              setMessages(loadedMessages)

              // Set up real-time listener
              const unsubscribe = complexQuery.onSnapshot((snapshot: any) => {
                const updatedMessages: Message[] = []
                snapshot.forEach((doc: any) => {
                  updatedMessages.push({ id: doc.id, ...doc.data() } as Message)
                })
                setMessages(updatedMessages)
              })

              return unsubscribe
            } catch (indexError: any) {
              // Check if this is an index error
              if (indexError.message && indexError.message.includes("index")) {
                // Extract the index creation URL from the error message
                const urlMatch = indexError.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/)
                if (urlMatch) {
                  setIndexUrl(urlMatch[0])
                }

                setError("Firestore index required")
                console.error("Index error:", indexError.message)

                // Use a simpler query without ordering as a fallback
                const fallbackQuery = messagesRef.where("userId", "==", user.uid)

                const fallbackSnapshot = await fallbackQuery.get()
                const fallbackMessages: Message[] = []
                fallbackSnapshot.forEach((doc: any) => {
                  fallbackMessages.push({ id: doc.id, ...doc.data() } as Message)
                })

                // Sort messages client-side as a temporary solution
                fallbackMessages.sort((a, b) => {
                  if (!a.timestamp || !b.timestamp) return 0
                  return a.timestamp.seconds - b.timestamp.seconds
                })

                setMessages(fallbackMessages)

                // Set up a simple listener without ordering
                const unsubscribe = fallbackQuery.onSnapshot((snapshot: any) => {
                  const updatedMessages: Message[] = []
                  snapshot.forEach((doc: any) => {
                    updatedMessages.push({ id: doc.id, ...doc.data() } as Message)
                  })

                  // Sort messages client-side
                  updatedMessages.sort((a, b) => {
                    if (!a.timestamp || !b.timestamp) return 0
                    return a.timestamp.seconds - b.timestamp.seconds
                  })

                  setMessages(updatedMessages)
                })

                return unsubscribe
              } else {
                // This is some other error
                throw indexError
              }
            }
          } catch (error: any) {
            console.error("Error accessing Firestore:", error)
            if (error.code === "permission-denied") {
              setError("permission-denied")
            } else {
              setError("Error accessing chat history: " + error.message)
            }
            return () => {}
          }
        } catch (error: any) {
          console.error("Error accessing Firestore:", error)
          if (error.code === "permission-denied") {
            setError("permission-denied")
          } else {
            setError("Error accessing chat history: " + error.message)
          }
          return () => {}
        }
      }

      const unsubscribePromise = setupFirestore()

      return () => {
        unsubscribePromise.then((unsubscribe: any) => {
          if (typeof unsubscribe === "function") {
            unsubscribe()
          }
        })
      }
    } catch (error: any) {
      console.error("Error setting up Firestore:", error)
      setError("Error setting up chat: " + error.message)
    }
  }, [user, isInitialized, isFirebaseReady, isDbAvailable])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Add initial welcome message
  useEffect(() => {
    if (user && isInitialized && messages.length === 0 && !error && isFirebaseReady && isDbAvailable) {
      const db = getFirebaseDb()
      if (!db) return

      const addWelcomeMessage = async () => {
        try {
          // Use the correct method to get a server timestamp in Firebase compat
          const welcomeMessage: Message = {
            content:
              "# Welcome to Eco-Friendly Travel Planner! 🌍✈️\n\nI'm your sustainable travel assistant. I can help you discover eco-friendly destinations and provide tips for reducing your environmental impact while traveling.\n\n**Try asking me:**\n- Suggest an eco-friendly destination in Europe\n- How can I travel sustainably in Japan?\n- What are some eco-friendly accommodations in Costa Rica?\n- Tips for reducing my carbon footprint while traveling\n\nWhere would you like to explore today?",
            role: "assistant",
            timestamp: window.firebase.firestore.FieldValue.serverTimestamp(),
            userId: user.uid,
          }

          await db.collection("messages").add(welcomeMessage)
        } catch (error: any) {
          console.error("Error adding welcome message:", error)
          if (error.code === "permission-denied") {
            setError("permission-denied")
          } else {
            setError("Error adding welcome message: " + error.message)
          }
        }
      }

      addWelcomeMessage()
    } else if (user && isInitialized && messages.length === 0 && !error && isFirebaseReady && !isDbAvailable) {
      // If Firestore is not available, add a welcome message to the local state
      setMessages([
        {
          content:
            "# Welcome to Eco-Friendly Travel Planner! 🌍✈️\n\nI'm your sustainable travel assistant. I can help you discover eco-friendly destinations and provide tips for reducing your environmental impact while traveling.\n\n**Try asking me:**\n- Suggest an eco-friendly destination in Europe\n- How can I travel sustainably in Japan?\n- What are some eco-friendly accommodations in Costa Rica?\n- Tips for reducing my carbon footprint while traveling\n\nWhere would you like to explore today?\n\n**Note:** Chat history will not be saved in this session due to database connectivity issues.",
          role: "assistant",
          userId: user.uid,
        },
      ])
    }
  }, [user, isInitialized, messages.length, error, isFirebaseReady, isDbAvailable])

  const handleSignOut = async () => {
    if (!isFirebaseReady) return

    const auth = getFirebaseAuth()
    if (!auth) return

    try {
      await auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !user || !isInitialized || !isFirebaseReady) return

    // Don't allow sending messages if we have an index error
    if (indexUrl) {
      setError("Please create the required Firestore index before continuing")
      return
    }

    setError(null)

    try {
      // Add user message to local state first
      const userMessage: Message = {
        content: input,
        role: "user",
        userId: user.uid,
      }

      // If Firestore is available, add to database
      if (isDbAvailable) {
        const db = getFirebaseDb()
        if (db) {
          // Use the correct method to get a server timestamp in Firebase compat
          userMessage.timestamp = window.firebase.firestore.FieldValue.serverTimestamp()
          await db.collection("messages").add(userMessage)
        }
      } else {
        // Otherwise just add to local state
        setMessages((prev) => [...prev, userMessage])
      }

      setInput("")
      setLoading(true)

      // Create context from previous messages (limit to last 10 for context window)
      const recentMessages = messages
        .slice(-10)
        .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n")

      const prompt = `
You are an eco-friendly travel planner assistant. Your goal is to help users plan sustainable travel experiences that minimize environmental impact.

Previous conversation:
${recentMessages}

User's latest message: ${input}

Format your response using Markdown. Use headings, lists, and emphasis to make your response more readable.

Provide helpful, informative responses about eco-friendly travel options. If the user is asking about a specific destination, include details about:
1. Sustainable transportation options
2. Eco-friendly accommodations
3. Responsible tourism activities
4. Local conservation efforts
5. Tips for reducing carbon footprint while traveling

If you're suggesting a destination, format your response to include a clear destination name at the beginning that I can extract. Start with a heading that is just the destination name.

Current user message: ${input}
`

      const systemPrompt =
        "You are an eco-friendly travel assistant that helps users plan sustainable trips. Provide detailed, helpful responses about eco-friendly destinations, accommodations, and activities. Format your responses using Markdown with headings, lists, and emphasis. When suggesting destinations, clearly state the destination name as a heading at the beginning of your response."

      // Call our API route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          systemPrompt,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate response")
      }

      const data = await response.json()
      const { text, destinationName, usedFallback } = data

      // Update fallback state if we're using mock data
      setUsingFallback(!!usedFallback)

      // If we have a destination name, get an image for it
      if (destinationName) {
        const imageUrl = await getDestinationImage(destinationName)
        setDestination({
          name: destinationName,
          description: text,
          imageUrl: imageUrl,
        })

        // Open the mobile destination sheet if on mobile
        setIsMobileDestinationOpen(true)
      }

      // Create assistant message
      const assistantMessage: Message = {
        content: text,
        role: "assistant",
        userId: user.uid,
      }

      // If Firestore is available, add to database
      if (isDbAvailable) {
        const db = getFirebaseDb()
        if (db) {
          // Use the correct method to get a server timestamp in Firebase compat
          assistantMessage.timestamp = window.firebase.firestore.FieldValue.serverTimestamp()
          await db.collection("messages").add(assistantMessage)
        } else {
          // Otherwise just add to local state
          setMessages((prev) => [...prev, assistantMessage])
        }
      } else {
        // Otherwise just add to local state
        setMessages((prev) => [...prev, userMessage, assistantMessage])
      }
    } catch (error: any) {
      console.error("Error in chat flow:", error)
      setError(error.message || "An error occurred while processing your request")

      // Only try to add error message if we have Firestore access
      if (isDbAvailable) {
        const db = getFirebaseDb()
        if (db) {
          try {
            // Add error message to Firestore
            const errorMessage: Message = {
              content: "I'm sorry, I encountered an error processing your request. Please try again.",
              role: "assistant",
              timestamp: window.firebase.firestore.FieldValue.serverTimestamp(),
              userId: user.uid,
            }

            await db.collection("messages").add(errorMessage)
          } catch (innerError) {
            console.error("Error adding error message:", innerError)
          }
        }
      } else {
        // Add error message to local state
        setMessages((prev) => [
          ...prev,
          {
            content: "I'm sorry, I encountered an error processing your request. Please try again.",
            role: "assistant",
            userId: user.uid,
          },
        ])
      }
    } finally {
      setLoading(false)
    }
  }

  // Determine what to render based on error state
  const renderContent = () => {
    if (!isFirebaseReady) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-green-800 font-medium">Initializing Firebase...</p>
          </div>
        </div>
      )
    } else if (error === "permission-denied") {
      return (
        <div className="flex-1 p-4 overflow-auto">
          <FirebaseSetupGuide />
        </div>
      )
    } else if (indexUrl) {
      return (
        <div className="flex-1 p-4 overflow-auto">
          <FirestoreIndexGuide indexUrl={indexUrl} />
        </div>
      )
    } else {
      return (
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!isDbAvailable && (
              <Alert className="mb-4 bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-700">
                  Database connection is unavailable. Chat history will not be saved.
                </AlertDescription>
              </Alert>
            )}

            {usingFallback && (
              <Alert className="mb-4 bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  Using demo mode with pre-defined responses. For full functionality, please ensure your Gemini API key
                  is valid.
                </AlertDescription>
              </Alert>
            )}

            {destination && (
              <div className="md:hidden mb-4">
                <Sheet open={isMobileDestinationOpen} onOpenChange={setIsMobileDestinationOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full border-green-200 bg-green-50 text-green-800">
                      <MapPin className="h-4 w-4 mr-2" />
                      View {destination.name} Details
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[80vh] p-0 rounded-t-xl">
                    <div className="h-full overflow-y-auto p-1">
                      <DestinationCard destination={destination} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            )}

            <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-1 custom-scrollbar">
              {messages.map((message, index) => (
                <div
                  key={message.id || index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className={message.role === "user" ? "ml-2 mt-0.5" : "mr-2 mt-0.5"}>
                      <AvatarFallback
                        className={message.role === "user" ? "bg-gray-600 text-white" : "bg-green-600 text-white"}
                      >
                        {message.role === "user" ? user?.email?.charAt(0).toUpperCase() || "U" : "AI"}
                      </AvatarFallback>
                    </Avatar>
                    <Card
                      className={`${
                        message.role === "user"
                          ? "bg-green-600 text-white border-green-700"
                          : "bg-white border-green-100"
                      } shadow-sm`}
                    >
                      <CardContent className="p-3">
                        {message.role === "assistant" ? (
                          <MarkdownRenderer
                            content={message.content}
                            className={message.role === "user" ? "text-white prose-invert" : ""}
                          />
                        ) : (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-start max-w-[85%]">
                    <Avatar className="mr-2 mt-0.5">
                      <AvatarFallback className="bg-green-600 text-white">AI</AvatarFallback>
                    </Avatar>
                    <Card className="bg-white border-green-100 shadow-sm">
                      <CardContent className="p-3 flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2 text-green-600" />
                        <p>Thinking about eco-friendly options...</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about eco-friendly travel destinations..."
                className="flex-1 border-green-200 focus-visible:ring-green-500"
                disabled={loading || !!error}
              />
              <Button
                type="submit"
                disabled={loading || !input.trim() || !!error}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {destination && (
            <div className="w-1/3 p-4 border-l border-green-200 overflow-y-auto hidden md:block custom-scrollbar">
              <DestinationCard destination={destination} />
            </div>
          )}
        </div>
      )
    }
  }

  return (
    <div className="flex flex-col h-screen bg-green-50">
      <header className="bg-green-800 text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <Leaf className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold">Eco-Friendly Travel Planner</h1>
        </div>
        <Button variant="ghost" onClick={handleSignOut} className="text-white hover:bg-green-700">
          <LogOut className="h-5 w-5 mr-2" />
          Sign Out
        </Button>
      </header>

      {renderContent()}
    </div>
  )
}
