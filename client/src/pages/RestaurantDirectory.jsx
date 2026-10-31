import { useEffect, useState } from "react"
import CuisineFilter from "../components/CuisineFilter"
import DirectoryHeader from "../components/DirectoryHeader"
import RestaurantMap from "../components/RestaurantMap"
import RestaurantList from "../components/RestaurantList"
import SearchBar from "../components/SearchBar"
import SiteHeader from "../components/SiteHeader"
import { apiBaseUrl } from "../lib/api"

function RestaurantDirectory() {
    const [restaurants, setRestaurants] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCuisine, setSelectedCuisine] = useState('All')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [mobileView, setMobileView] = useState('list')

    useEffect(() => {
        async function fetchRestaurants() {
            try {
                const response = await fetch(`${apiBaseUrl}/restaurants`)

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

    const cuisines = [...new Set(restaurants.flatMap((restaurant) => restaurant.tags))].sort()

    const filteredRestaurants = restaurants.filter((restaurant) => {
        const matchesCuisine = selectedCuisine === 'All' || restaurant.tags.includes(selectedCuisine)

        return matchesCuisine && (
            restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })

    if (loading) return <p>Loading restaurants...</p>
    if (error) return <p>{error}</p>

    return (
        <main>
            <SiteHeader />

            <section className="directory app-shell" aria-labelledby="directory-heading">
                <DirectoryHeader resultCount={filteredRestaurants.length} />

                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />

                <CuisineFilter
                    cuisines={cuisines}
                    selectedCuisine={selectedCuisine}
                    onCuisineChange={setSelectedCuisine}
                />

                <div className="directory-view-toggle" role="tablist" aria-label="Directory view">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={mobileView === 'list'}
                        onClick={() => setMobileView('list')}
                    >
                        List
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={mobileView === 'map'}
                        onClick={() => setMobileView('map')}
                    >
                        Map
                    </button>
                </div>

                <div className="directory-explorer">
                    <section
                        className={`directory-list-panel ${mobileView === 'list' ? 'is-mobile-visible' : 'is-mobile-hidden'}`}
                        aria-label="Restaurant results"
                    >
                        <RestaurantList restaurants={filteredRestaurants} />
                    </section>
                    <RestaurantMap
                        restaurants={filteredRestaurants}
                        visible={
                            mobileView === 'map' ||
                            window.matchMedia('(min-width: 701px)').matches
                        }
                    />
                </div>
            </section>
        </main>
    )
}

export default RestaurantDirectory