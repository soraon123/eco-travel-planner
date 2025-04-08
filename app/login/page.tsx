"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { isFirebaseInitialized, isFirebaseAuthInitialized, getFirebaseAuth } from "@/lib/firebase"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isFirebaseReady, setIsFirebaseReady] = useState(false)
  const router = useRouter()

  // Check if Firebase is initialized
  useEffect(() => {
    const checkFirebase = () => {
      if (isFirebaseInitialized() && isFirebaseAuthInitialized()) {
        setIsFirebaseReady(true)
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

  // Check if user is already logged in
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
            router.push("/chat")
          }
        })
      } catch (err) {
        console.error("Error checking auth state:", err)
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFirebaseReady) {
      setError("Firebase is not initialized yet. Please try again.")
      return
    }

    const auth = getFirebaseAuth()
    if (!auth) {
      setError("Authentication service is not available. Please try again.")
      return
    }

    setLoading(true)
    setError("")

    try {
      await auth.createUserWithEmailAndPassword(email, password)
      router.push("/chat")
    } catch (error: any) {
      console.error("Sign up error:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFirebaseReady) {
      setError("Firebase is not initialized yet. Please try again.")
      return
    }

    const auth = getFirebaseAuth()
    if (!auth) {
      setError("Authentication service is not available. Please try again.")
      return
    }

    setLoading(true)
    setError("")

    try {
      await auth.signInWithEmailAndPassword(email, password)
      router.push("/chat")
    } catch (error: any) {
      console.error("Sign in error:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-green-800">Welcome</CardTitle>
          <CardDescription className="text-center">
            Sign in or create an account to start planning your eco-friendly travels
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isFirebaseReady ? (
            <div className="text-center py-4">
              <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-green-800">Initializing authentication...</p>
            </div>
          ) : (
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleSignIn}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={handleSignUp}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-email">Email</Label>
                      <Input
                        id="new-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                      {loading ? "Creating account..." : "Create Account"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        <CardFooter>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
