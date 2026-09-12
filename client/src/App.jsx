import DirectoryHeader from "./components/DirectoryHeader"
import RestaurantList from "./components/RestaurantList"
import RestaurantDetails from "./components/RestaurantDetails"
import SearchBar from "./components/SearchBar"
import SiteHeader from "./components/SiteHeader"
import { useEffect, useState } from "react"

function App() {


  const [restaurants, setRestaurants] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState("")

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const response = await fetch('http://localhost:5000/api/restaurants')

        if (!response.ok) {
          throw new Error("failed to fetch restaurants");

        }

        const data = await response.json()
        setRestaurants(data.restaurants)

      } catch {
        setError('could not load restaurants')
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  useEffect(() => {
    if (selectedRestaurantId === null) {
      return
    }

    async function fetchRestaurantDetails() {
      setDetailsLoading(true)
      setDetailsError("")

      try {
        const response = await fetch(`http://localhost:5000/api/restaurants/${selectedRestaurantId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch restaurant details")
        }

        const data = await response.json()
        setSelectedRestaurant(data.restaurant)
      } catch {
        setDetailsError("Could not load restaurant details")
      } finally {
        setDetailsLoading(false)
      }
    }

    fetchRestaurantDetails()
  }, [selectedRestaurantId])

  const filteredRestaurants = restaurants.filter((restaurant) => {
    return (
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  if (loading) return <p>Loading restaurants...</p>
  if (error) return <p>{error}</p>

  if (selectedRestaurantId !== null) {
    return (
      <main className="app-shell">
        <SiteHeader />

        {detailsLoading && <p>Loading restaurant details...</p>}
        {detailsError && <p>{detailsError}</p>}
        {selectedRestaurant && !detailsLoading && !detailsError && (
          <RestaurantDetails
            restaurant={selectedRestaurant}
            onBack={() => {
              setSelectedRestaurantId(null)
              setSelectedRestaurant(null)
            }}
          />
        )}
      </main>
    )
  }

  return (
    <main className="app-shell">
      <SiteHeader />

      <section className="directory" aria-labelledby="directory-heading">
        <DirectoryHeader resultCount={filteredRestaurants.length} />

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <RestaurantList
          restaurants={filteredRestaurants}
          onSelect={setSelectedRestaurantId}
        />
      </section>
    </main>
  )
}

export default App
