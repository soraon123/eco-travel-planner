"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, MapPin, Heart, Share2 } from "lucide-react"
import { MarkdownRenderer } from "./markdown-renderer"

type DestinationProps = {
  destination: {
    name: string
    description: string
    imageUrl: string
  }
}

export function DestinationCard({ destination }: DestinationProps) {
  const [saved, setSaved] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Extract the first paragraph for the summary
  const summary = destination.description.split("\n")[0]

  // Function to open Google Maps for the destination
  const openGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination.name)}`, "_blank")
  }

  return (
    <Card className="overflow-hidden shadow-lg border-green-100">
      <div className="relative h-64 w-full bg-green-100 overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={destination.imageUrl || "/placeholder.svg"}
          alt={destination.name}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true)
            setImageLoaded(true)
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50"></div>
        <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-md">
          <Leaf className="h-3 w-3 mr-1" />
          Eco-Friendly
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold drop-shadow-md">{destination.name}</h2>
          <div className="flex items-center mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">Sustainable Destination</span>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="prose prose-sm mb-4">
          <MarkdownRenderer content={summary} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <h4 className="text-xs font-semibold text-green-800 uppercase tracking-wide">Eco-Transport</h4>
            <p className="text-xs text-gray-600 mt-1">Available</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <h4 className="text-xs font-semibold text-green-800 uppercase tracking-wide">Green Hotels</h4>
            <p className="text-xs text-gray-600 mt-1">Multiple options</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <h4 className="text-xs font-semibold text-green-800 uppercase tracking-wide">Carbon Offset</h4>
            <p className="text-xs text-gray-600 mt-1">Available</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <h4 className="text-xs font-semibold text-green-800 uppercase tracking-wide">Local Guides</h4>
            <p className="text-xs text-gray-600 mt-1">Recommended</p>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-4">
          <h3 className="font-semibold text-green-800 mb-2">Full Destination Details</h3>
          <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            <MarkdownRenderer content={destination.description} />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-6 pt-0">
        <Button
          variant="outline"
          className={saved ? "text-red-600 border-red-600" : "text-green-600 border-green-600"}
          onClick={() => setSaved(!saved)}
        >
          <Heart className={`h-4 w-4 mr-2 ${saved ? "fill-red-600" : ""}`} />
          {saved ? "Saved" : "Save"}
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" className="text-green-600 border-green-600" onClick={openGoogleMaps}>
            <MapPin className="h-4 w-4 mr-2" />
            Map
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
