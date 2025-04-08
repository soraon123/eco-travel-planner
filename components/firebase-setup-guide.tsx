import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export function FirebaseSetupGuide() {
  return (
    <Card className="max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-xl text-red-600">Firebase Permission Error</CardTitle>
        <CardDescription>Your application is encountering permission issues with Firebase</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Missing or insufficient permissions</AlertTitle>
          <AlertDescription>
            Your application cannot access the Firestore database due to permission restrictions.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h3 className="font-semibold">To fix this issue, follow these steps:</h3>

          <div className="space-y-2">
            <h4 className="font-medium">1. Go to your Firebase Console</h4>
            <p className="text-sm text-gray-600">
              Navigate to your Firebase project at{" "}
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://console.firebase.google.com/
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">2. Update Firestore Security Rules</h4>
            <p className="text-sm text-gray-600">
              Go to Firestore Database → Rules and replace the existing rules with:
            </p>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
              {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own messages
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Allow authenticated users to read and write their own user data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`}
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">3. Publish the Rules</h4>
            <p className="text-sm text-gray-600">Click "Publish" to apply the new security rules.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">4. Refresh this Page</h4>
            <p className="text-sm text-gray-600">After updating the rules, refresh this page to try again.</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        These rules allow authenticated users to read all messages but only modify their own messages.
      </CardFooter>
    </Card>
  )
}
