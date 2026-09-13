import { useParams } from "react-router-dom"


function RestaurantDetailsPage() {
    const { id } = useParams()

    return <p>Restaurant ID: {id}</p>
}

export default RestaurantDetailsPage