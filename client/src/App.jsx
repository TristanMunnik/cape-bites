import { useState } from "react"
import DirectoryHeader from "./components/DirectoryHeader"
import RestaurantList from "./components/RestaurantList"
import SearchBar from "./components/SearchBar"
import SiteHeader from "./components/SiteHeader"

const restaurants = [
  {
    id: 1,
    name: 'Kumo House',
    cuisine: 'Japanese',
    neighborhood: 'Gardens',
    priceRange: '$$',
    rating: 4.5,
    accent: 'saffron',
    description: 'Demo listing for ramen, small plates, and Japanese comfort food.',
  },
  {
    id: 2,
    name: 'Lotus Table',
    cuisine: 'Vietnamese',
    neighborhood: 'De Waterkant',
    priceRange: '$$',
    rating: 4.7,
    accent: 'coral',
    description: 'Demo listing for bright noodle bowls and fresh street-food flavours.',
  },
  {
    id: 3,
    name: 'Seoul Bird',
    cuisine: 'Korean',
    neighborhood: 'Woodstock',
    priceRange: '$$$',
    rating: 4.3,
    accent: 'jade',
    description: 'Demo listing for Korean barbecue, fried chicken, and shared plates.',
  },
  {
    id: 4,
    name: 'Mango & Rice',
    cuisine: 'Thai',
    neighborhood: 'Sea Point',
    priceRange: '$$',
    rating: 4.6,
    accent: 'indigo',
    description: 'Demo listing for fragrant curries and quick Thai-inspired lunches.',
  },
]

function App() {

  const [searchTerm, setSearchTerm] = useState('')

  const filteredRestaurants = restaurants.filter((restaurant) => {
    return (
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <main className="app-shell">
      <SiteHeader />

      <section className="directory" aria-labelledby="directory-heading">
        <DirectoryHeader resultCount={filteredRestaurants.length} />

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <RestaurantList restaurants={filteredRestaurants} />
      </section>
    </main>
  )
}

export default App
