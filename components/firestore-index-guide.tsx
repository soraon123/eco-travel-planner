import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

type FirestoreIndexGuideProps = {
  indexUrl: string
}

export function FirestoreIndexGuide({ indexUrl }: FirestoreIndexGuideProps) {
  return (
    <Card className="max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-xl text-amber-600">Firestore Index Required</CardTitle>
        <CardDescription>Your application needs a Firestore index to be created</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="warning" className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Missing Firestore Index</AlertTitle>
          <AlertDescription className="text-amber-700">
            Your application needs a Firestore index to efficiently query messages.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h3 className="font-semibold">To fix this issue, follow these steps:</h3>

          <div className="space-y-2">
            <h4 className="font-medium">1. Create the Required Index</h4>
            <p className="text-sm text-gray-600">
              Click the link below to open the Firebase console and create the required index:
            </p>
            <a
              href={indexUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Create Firestore Index
            </a>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">2. Wait for Index to Build</h4>
            <p className="text-sm text-gray-600">
              After creating the index, it may take a few minutes for Firebase to build it. The status will be shown in
              the Firebase console.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">3. Refresh this Page</h4>
            <p className="text-sm text-gray-600">
              Once the index is built (shows as "Enabled" in Firebase console), refresh this page to start using the
              application.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        This is a one-time setup. You won't need to create this index again.
      </CardFooter>
    </Card>
  )
}
