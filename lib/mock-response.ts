// This file provides mock responses for when the Gemini API is unavailable
// It helps ensure the application can still function for demo purposes

const mockResponses = [
  {
    destination: "Costa Rica",
    response: `# Costa Rica

Costa Rica is an excellent choice for eco-friendly travel! This Central American country is a global leader in sustainable tourism.

## Sustainable Transportation
- Use their efficient public bus system to travel between cities
- Rent electric vehicles, which are increasingly available
- Consider shared shuttles for popular routes
- Many eco-lodges offer carbon-neutral transportation options

## Eco-Friendly Accommodations
- Stay at eco-lodges certified by the Certification for Sustainable Tourism (CST)
- Look for properties that use renewable energy and water conservation practices
- Consider community-based tourism initiatives that benefit local populations
- Try unique options like tree houses in Monteverde or solar-powered cabins

## Responsible Tourism Activities
- Visit national parks like Manuel Antonio or Monteverde Cloud Forest Reserve
- Take guided tours with certified naturalists
- Participate in wildlife conservation projects
- Try sustainable adventure activities like zip-lining or hiking
- Support local artisans and farmers' markets

## Local Conservation Efforts
- Costa Rica aims to be carbon-neutral by 2050
- They've reversed deforestation, increasing forest cover from 21% to over 50%
- Many hotels and tour operators contribute to local conservation funds
- The country generates over 98% of its electricity from renewable sources

## Tips for Reducing Carbon Footprint
- Offset your flight emissions through verified carbon offset programs
- Bring reusable water bottles and filters
- Support businesses with sustainable practices
- Respect wildlife by maintaining distance and not feeding animals
- Choose locally-owned restaurants serving local, organic food

Would you like more specific information about any region of Costa Rica?`,
  },
  {
    destination: "Sweden",
    response: `# Sweden

Sweden is an excellent choice for eco-conscious travelers! This Scandinavian country is consistently ranked among the world's most sustainable destinations.

## Sustainable Transportation
- Sweden's extensive train network is powered largely by renewable energy
- Major cities have excellent public transportation systems
- Bike-sharing programs are available in Stockholm, Gothenburg, and Malmö
- Consider electric car rentals for exploring rural areas
- Ferry services between coastal areas are efficient and scenic

## Eco-Friendly Accommodations
- Look for hotels with Nordic Swan Ecolabel certification
- Many properties use renewable energy and have strong waste reduction programs
- Try unique eco-experiences like treehotels in Lapland or solar-powered floating hotels
- Consider "ice hotels" in winter, which melt in spring leaving no environmental trace
- Eco-friendly hostels are abundant in major cities

## Responsible Tourism Activities
- Explore Sweden's 30 national parks, like Abisko or Tyresta
- Join guided foraging tours to learn about local plants and fungi
- Experience the Swedish "allemansrätten" (right to roam) responsibly
- Visit eco-museums and sustainable urban developments
- Participate in "plogging" (picking up litter while jogging)

## Local Conservation Efforts
- Sweden aims to be carbon-neutral by 2045
- The country recycles nearly 99% of household waste
- Many municipalities have implemented circular economy principles
- Sweden's "Fossil Free Sweden" initiative is transforming industries
- Extensive rewilding projects are restoring natural habitats

## Tips for Reducing Carbon Footprint
- Drink tap water (Sweden's is excellent) instead of bottled water
- Shop at local markets for sustainable products
- Use the extensive recycling facilities available everywhere
- Consider carbon offsetting for your flights
- Eat locally-sourced, seasonal foods

Would you like more specific information about any particular region of Sweden?`,
  },
  {
    destination: "New Zealand",
    response: `# New Zealand

New Zealand is a fantastic choice for eco-friendly travel! The country is committed to sustainable tourism through its "Tiaki Promise" - a commitment to care for the land and people.

## Sustainable Transportation
- Use the extensive intercity bus network to travel between destinations
- Consider rail journeys like the TranzAlpine for scenic and low-impact travel
- Rent electric vehicles, which are increasingly available throughout the country
- Try cycling on the many dedicated bike trails like the Alps 2 Ocean
- Use ferry services between the North and South Islands

## Eco-Friendly Accommodations
- Look for properties with Qualmark Green certification
- Stay at eco-lodges that use renewable energy and practice water conservation
- Consider "glamping" options that have minimal environmental impact
- Try farm stays that practice sustainable agriculture
- Book accommodations that contribute to conservation efforts

## Responsible Tourism Activities
- Visit dark sky reserves for stargazing without light pollution
- Take guided nature walks with certified operators
- Participate in conservation projects like tree planting or bird monitoring
- Experience Māori cultural tours that support indigenous communities
- Join beach clean-up initiatives along the coastline

## Local Conservation Efforts
- New Zealand aims to be carbon-neutral by 2050
- The Predator Free 2050 initiative works to protect native wildlife
- Many regions have extensive reforestation and habitat restoration projects
- Marine reserves protect coastal ecosystems
- Community-led conservation projects are restoring native bird populations

## Tips for Reducing Carbon Footprint
- Offset your flight emissions through verified programs
- Follow the "Leave No Trace" principles when hiking
- Support businesses with sustainable practices
- Respect wildlife by maintaining distance and following guidelines
- Choose locally-produced food and beverages

Would you like more specific information about the North or South Island?`,
  },
]

export function getMockResponse(query: string): { text: string; destinationName: string } {
  // Select a random response
  const randomIndex = Math.floor(Math.random() * mockResponses.length)
  const mockResponse = mockResponses[randomIndex]

  return {
    text: mockResponse.response,
    destinationName: mockResponse.destination,
  }
}
