// Utility function to check if the Gemini API key is valid
export async function isGeminiApiKeyValid(apiKey: string): Promise<boolean> {
  if (!apiKey) return false

  try {
    // Try to list models as a simple validation check
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
      method: "GET",
    })

    return response.ok
  } catch (error) {
    console.error("Error validating Gemini API key:", error)
    return false
  }
}
