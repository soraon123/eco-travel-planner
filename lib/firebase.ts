// This file provides helper functions to safely access Firebase services

// Helper function to check if Firebase is initialized
export function isFirebaseInitialized(): boolean {
  return typeof window !== "undefined" && !!window.firebase && !!window.firebaseApp
}

// Helper function to check if Firebase Auth is initialized
export function isFirebaseAuthInitialized(): boolean {
  return typeof window !== "undefined" && !!window.firebaseAuth
}

// Helper function to check if Firestore is initialized
export function isFirestoreInitialized(): boolean {
  return typeof window !== "undefined" && !!window.firebaseDb
}

// Helper function to get Firebase Auth safely
export function getFirebaseAuth() {
  if (typeof window !== "undefined" && window.firebaseAuth) {
    return window.firebaseAuth
  }
  return null
}

// Helper function to get Firestore safely
export function getFirebaseDb() {
  if (typeof window !== "undefined" && window.firebaseDb) {
    return window.firebaseDb
  }
  return null
}

// Helper function to get Firebase App safely
export function getFirebaseApp() {
  if (typeof window !== "undefined" && window.firebaseApp) {
    return window.firebaseApp
  }
  return null
}

// Define global types for TypeScript
declare global {
  interface Window {
    firebase: any
    firebaseAuth: any
    firebaseDb: any
    firebaseApp: any
  }
}
