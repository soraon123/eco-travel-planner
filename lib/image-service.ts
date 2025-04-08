// This service fetches images from Unsplash for destinations

// Function to get a random image from Unsplash for a destination
export async function getDestinationImage(destinationName: string): Promise<string> {
  try {
    // Construct a search query for Unsplash
    const query = encodeURIComponent(`${destinationName} travel eco friendly nature`)

    // Use Unsplash Source API for direct image URLs
    // This is a simple way to get images without requiring an API key
    return `https://source.unsplash.com/random/800x600/?${query}`
  } catch (error) {
    console.error("Error fetching destination image:", error)
    return `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(destinationName)}`
  }
}
