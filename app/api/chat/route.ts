import { NextResponse } from "next/server"
import { gemini } from "@/lib/gemini"
import { getMockResponse } from "@/lib/mock-response"
import { isGeminiApiKeyValid } from "@/lib/api-utils"

export async function POST(req: Request) {
  try {
    const { prompt, systemPrompt } = await req.json()

    // Check if we have a valid API key
    const apiKey = process.env.GEMINI_API_KEY
    const isApiKeyValid = apiKey ? await isGeminiApiKeyValid(apiKey) : false

    // Try to use the Gemini API if we have a valid key
    if (isApiKeyValid) {
      try {
        // Create a Gemini provider instance with the correct model name
        const geminiProvider = gemini("gemini-1.5-pro")

        // Call the generate method directly
        const result = await geminiProvider.generate({
          prompt,
          system: systemPrompt,
        })

        const text = result.text

        // Extract destination name if possible
        let destinationName = null
        const destinationMatch = text.match(/^(.*?)(?::|,|\n)/)
        if (destinationMatch && destinationMatch[1].length < 50) {
          destinationName = destinationMatch[1].trim()
        }

        return NextResponse.json({
          text,
          destinationName,
        })
      } catch (geminiError) {
        console.error("Gemini API error, using fallback:", geminiError)
        // Fall through to use mock response
      }
    }

    // Use mock response as fallback
    const { text, destinationName } = getMockResponse(prompt)

    return NextResponse.json({
      text,
      destinationName,
      usedFallback: true,
    })
  } catch (error: any) {
    console.error("Error in chat route:", error)

    // Provide a more helpful error message
    let errorMessage = "An error occurred during text generation"

    if (error.message) {
      if (error.message.includes("API key")) {
        errorMessage = "Invalid or missing Gemini API key. Please check your environment variables."
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
