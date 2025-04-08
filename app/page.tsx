import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-green-800">
                  Eco-Friendly Travel Planner
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover sustainable travel options and reduce your carbon footprint while exploring the world. Our
                  AI-powered chatbot helps you plan eco-conscious adventures.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:ml-auto">
                <img
                  alt="Eco-friendly travel"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                  src="/placeholder.svg?height=550&width=800"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-800">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-green-800">
                  Why Choose Our Eco-Travel Planner?
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered chatbot helps you make environmentally conscious travel decisions.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2 border border-green-100 p-6 rounded-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-green-800"
                  >
                    <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                    <path d="M8.5 8.5v.01" />
                    <path d="M16 15.5v.01" />
                    <path d="M12 12v.01" />
                    <path d="M11 17v.01" />
                    <path d="M7 14v.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-800">Sustainable Destinations</h3>
                <p className="text-gray-600 text-center">
                  Discover eco-friendly destinations and accommodations that minimize environmental impact.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-green-100 p-6 rounded-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-green-800"
                  >
                    <path d="M3 7V5c0-1.1.9-2 2-2h2" />
                    <path d="M17 3h2c1.1 0 2 .9 2 2v2" />
                    <path d="M21 17v2c0 1.1-.9 2-2 2h-2" />
                    <path d="M7 21H5c-1.1 0-2-.9-2-2v-2" />
                    <rect width="7" height="5" x="7" y="7" rx="1" />
                    <rect width="7" height="5" x="10" y="12" rx="1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-800">Visual Inspiration</h3>
                <p className="text-gray-600 text-center">
                  See beautiful images of recommended destinations to inspire your next adventure.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-green-100 p-6 rounded-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-green-800"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-800">AI-Powered Advice</h3>
                <p className="text-gray-600 text-center">
                  Get personalized recommendations based on your preferences and environmental values.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-green-800 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <p className="text-sm text-green-100">© 2025 Eco-Friendly Travel Planner. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
