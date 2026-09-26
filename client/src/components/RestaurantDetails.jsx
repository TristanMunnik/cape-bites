import { useNavigate } from "react-router-dom"

function RestaurantDetails({ restaurant }) {
    const navigate = useNavigate()

    return (
        <section className="restaurant-details" aria-labelledby="restaurant-details-heading">
            <button className="back-button" onClick={() => navigate('/')} type="button">
                <span aria-hidden="true">←</span>
                Back to directory
            </button>

            <div className={`details-image ${restaurant.accent}`} aria-hidden="true" />

            <div className="details-content">
                <p className="eyebrow">Restaurant details</p>
                <div className="details-title-row">
                    <div>
                        <h2 id="restaurant-details-heading">{restaurant.name}</h2>
                        <p className="card-cuisine">{restaurant.cuisine}</p>
                    </div>
                    <span className="rating">
                        {restaurant.rating == null ? 'No reviews' : `★ ${restaurant.rating}`}
                    </span>
                </div>
                <p className="details-description">{restaurant.description}</p>
                <div className="details-meta">
                    <span>{restaurant.neighborhood}</span>
                    <span>{restaurant.priceRange}</span>
                </div>
                {restaurant.address && <p>{restaurant.address}</p>}
                {restaurant.website && (
                    <a href={restaurant.website} target="_blank" rel="noreferrer">
                        Restaurant website
                    </a>
                )}
            </div>
        </section>
    )
}

export default RestaurantDetails
