import type { AIProvider } from "ai"

// Create a proper Gemini provider that works with the AI SDK
export const gemini = (modelName: string): AIProvider => {
  return {
    id: "gemini",
    name: "Gemini",
    generate: async ({ prompt, system }) => {
      try {
        const apiKey = process.env.GEMINI_API_KEY

        if (!apiKey) {
          throw new Error("Missing Gemini API key")
        }

        // Format the prompt with system instructions if provided
        const formattedPrompt = system ? `${system}\n\n${prompt}` : prompt

        // Use the correct API endpoint for the model
        // Note: The model name should be passed without modification
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`

        console.log(`Using model: ${modelName}`)

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: formattedPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`)
        }

        const data = await response.json()

        // Extract the generated text from the response
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

        return {
          text,
          usage: {
            promptTokens: 0, // Gemini doesn't provide token usage in the same way
            completionTokens: 0,
            totalTokens: 0,
          },
          finishReason: data.candidates?.[0]?.finishReason || "stop",
        }
      } catch (error) {
        console.error("Error calling Gemini API:", error)
        throw error
      }
    },
  }
}
