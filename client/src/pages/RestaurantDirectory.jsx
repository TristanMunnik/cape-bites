import { useEffect, useState } from "react"
import CuisineFilter from "../components/CuisineFilter"
import DirectoryHeader from "../components/DirectoryHeader"
import RestaurantMap from "../components/RestaurantMap"
import RestaurantList from "../components/RestaurantList"
import RestaurantSkeleton from "../components/RestaurantSkeleton"
import SearchBar from "../components/SearchBar"
import SiteHeader from "../components/SiteHeader"
import StatusMessage from "../components/StatusMessage"
import { apiBaseUrl } from "../lib/api"

function RestaurantDirectory() {
    const [restaurants, setRestaurants] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCuisine, setSelectedCuisine] = useState('All')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [retryCount, setRetryCount] = useState(0)
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
                setError('Check your connection and try again.')
            } finally {
                setLoading(false)
            }
        }

        fetchRestaurants()
    }, [retryCount])

    function handleRetry() {
        setError('')
        setLoading(true)
        setRetryCount((count) => count + 1)
    }

    const cuisines = [...new Set(restaurants.flatMap((restaurant) => restaurant.tags))].sort()

    const filteredRestaurants = restaurants.filter((restaurant) => {
        const matchesCuisine = selectedCuisine === 'All' || restaurant.tags.includes(selectedCuisine)

        return matchesCuisine && (
            restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })

    const ready = !loading && !error

    return (
        <main>
            <SiteHeader />

            <section className="directory app-shell" aria-labelledby="directory-heading">
                <DirectoryHeader resultCount={ready ? filteredRestaurants.length : null} />

                {loading && <RestaurantSkeleton />}

                {error && (
                    <StatusMessage title="Could not load restaurants" message={error}>
                        <button className="status-button" type="button" onClick={handleRetry}>
                            Try again
                        </button>
                    </StatusMessage>
                )}

                {ready && (
                    <>
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
                    </>
                )}
            </section>
        </main>
    )
}

export default RestaurantDirectory
