import { Link } from "react-router-dom"
import RestaurantImage from "./RestaurantImage"

function RestaurantCard({ restaurant }) {
    const tags = restaurant.tags.filter((tag) => tag !== restaurant.cuisine)

    return (
        <Link
            className="restaurant-card"
            to={`/restaurants/${restaurant.id}`}
        >
            <RestaurantImage restaurant={restaurant} className="card-image" loading="lazy" />
            <div className="card-content">
                <div className="card-title-row">
                    <h3>{restaurant.name}</h3>
                    <span className="rating">
                        {restaurant.rating == null ? 'No reviews' : `★ ${restaurant.rating}`}
                    </span>
                </div>
                <p className="card-cuisine">{restaurant.cuisine}</p>
                <p className="card-description">{restaurant.description}</p>
                {tags.length > 0 && (
                    <ul className="card-tags">
                        {tags.map((tag) => <li key={tag}>{tag}</li>)}
                    </ul>
                )}
                <div className="card-meta">
                    <span>{restaurant.neighborhood}</span>
                    <span>{restaurant.priceRange}</span>
                </div>
            </div>
        </Link>
    )
}

export default RestaurantCard

