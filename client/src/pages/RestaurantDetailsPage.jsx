import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import RestaurantDetails from "../components/RestaurantDetails"


function RestaurantDetailsPage() {
    const { id } = useParams()
    const [restaurant, setRestaurant] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [notFound, setNotFound] = useState(false)



    useEffect(() => {
        async function fetchRestaurant() {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/restaurants/${id}`
                )

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

    if (notFound) {
        return <p>Restaurant not found</p>
    }

    if (loading) {
        return <p>Loading restaurant...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    return <RestaurantDetails restaurant={restaurant} />
}

export default RestaurantDetailsPage