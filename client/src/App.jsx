import DirectoryHeader from "./components/DirectoryHeader"
import RestaurantList from "./components/RestaurantList"
import SearchBar from "./components/SearchBar"
import SiteHeader from "./components/SiteHeader"
import { useEffect, useState } from "react"



function App() {


  const [restaurants, setRestaurants] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const response = await fetch('http://localhost:5000/api/restaurants')

        if (!response.ok) {
          throw new Error("failed to fetch restaurants");

        }

        const data = await response.json()
        setRestaurants(data.restaurants)

      } catch (err) {
        setError('could not load restaurants')
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  const filteredRestaurants = restaurants.filter((restaurant) => {
    return (
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  if (loading) return <p>Loading restaurants...</p>
  if (error) return <p>{error}</p>

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
