"use client"

import { type ReactNode, useEffect, useState } from "react"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Create a client-side only component
const FirebaseProviderClient = ({ children }: { children: ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)

  // Initialize Firebase using a script tag approach
  const initializeFirebase = () => {
    try {
      if (typeof window !== "undefined" && !window.firebase) {
        // Create a script element to load Firebase
        const script = document.createElement("script")
        script.src = "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
        script.async = true
        script.onload = () => {
          // Load Firebase Auth
          const authScript = document.createElement("script")
          authScript.src = "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth-compat.js"
          authScript.async = true
          authScript.onload = () => {
            // Load Firebase Firestore
            const firestoreScript = document.createElement("script")
            firestoreScript.src = "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore-compat.js"
            firestoreScript.async = true
            firestoreScript.onload = () => {
              // Initialize Firebase
              if (!window.firebase.apps.length) {
                window.firebase.initializeApp(firebaseConfig)
              }

              // Make Firebase services available globally
              window.firebaseApp = window.firebase.app()
              window.firebaseAuth = window.firebase.auth()
              window.firebaseDb = window.firebase.firestore()

              console.log("Firebase initialized successfully")
              setIsInitialized(true)
            }
            document.head.appendChild(firestoreScript)
          }
          document.head.appendChild(authScript)
        }
        document.head.appendChild(script)
      } else if (typeof window !== "undefined" && window.firebase) {
        // Firebase is already loaded
        if (!window.firebase.apps.length) {
          window.firebase.initializeApp(firebaseConfig)
        }

        // Make Firebase services available globally
        window.firebaseApp = window.firebase.app()
        window.firebaseAuth = window.firebase.auth()
        window.firebaseDb = window.firebase.firestore()

        console.log("Firebase already loaded and initialized")
        setIsInitialized(true)
      }
    } catch (error) {
      console.error("Firebase initialization error:", error)
      setInitError(error instanceof Error ? error.message : "Unknown error initializing Firebase")
    }
  }

  useEffect(() => {
    initializeFirebase()
  }, [])

  // Show loading state while Firebase initializes
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-800 font-medium">Initializing app...</p>
          {initError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 max-w-md mx-auto">
              <p className="font-semibold">Error initializing Firebase:</p>
              <p className="text-sm mt-1">{initError}</p>
              <p className="text-sm mt-2">The app will continue with limited functionality.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Create a wrapper component that only renders the client component on the client
export function FirebaseProvider({ children }: { children: ReactNode }) {
  return <FirebaseProviderClient>{children}</FirebaseProviderClient>
}

// Add global type definitions
declare global {
  interface Window {
    firebase: any
    firebaseApp: any
    firebaseAuth: any
    firebaseDb: any
  }
}
