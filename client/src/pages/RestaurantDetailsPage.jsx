import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import RestaurantDetails from "../components/RestaurantDetails"
import StatusMessage from "../components/StatusMessage"
import { apiBaseUrl } from "../lib/api"


function RestaurantDetailsPage() {
    const { id } = useParams()
    const [restaurant, setRestaurant] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [notFound, setNotFound] = useState(false)



    useEffect(() => {
        async function fetchRestaurant() {
            try {
                const response = await fetch(`${apiBaseUrl}/restaurants/${id}`)

                if (response.status === 404) {
                    setNotFound(true)
                    return
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch restaurant")
                }

                const data = await response.json()
                setRestaurant(data.restaurant)
            } catch {
                setError("Could not load restaurant")
            } finally {
                setLoading(false)
            }
        }

        fetchRestaurant()
    }, [id])

    const homeLink = <Link className="status-button" to="/">Back to directory</Link>

    return (
        <main className="app-shell details-page">
            {notFound ? (
                <StatusMessage
                    title="Restaurant not found"
                    message="This restaurant may have been removed."
                >
                    {homeLink}
                </StatusMessage>
            ) : loading ? (
                <StatusMessage title="Loading restaurant..." />
            ) : error ? (
                <StatusMessage title={error} message="Check your connection and try again.">
                    {homeLink}
                </StatusMessage>
            ) : (
                <RestaurantDetails restaurant={restaurant} />
            )}
        </main>
    )
}

export default RestaurantDetailsPage