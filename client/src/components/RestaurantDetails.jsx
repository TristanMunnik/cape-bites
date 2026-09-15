import { Link } from "react-router-dom"

function RestaurantDetails({ restaurant }) {
    return (
        <section className="restaurant-details" aria-labelledby="restaurant-details-heading">
            <Link className="back-button" to="/">
                ← Back to directory
            </Link>

            <div className={`details-image ${restaurant.accent}`} aria-hidden="true" />

            <div className="details-content">
                <p className="eyebrow">Restaurant details</p>
                <div className="details-title-row">
                    <div>
                        <h2 id="restaurant-details-heading">{restaurant.name}</h2>
                        <p className="card-cuisine">{restaurant.cuisine}</p>
                    </div>
                    <span className="rating">★ {restaurant.rating}</span>
                </div>
                <p className="details-description">{restaurant.description}</p>
                <div className="details-meta">
                    <span>{restaurant.neighborhood}</span>
                    <span>{restaurant.priceRange}</span>
                </div>
            </div>
        </section>
    )
}

export default RestaurantDetails
