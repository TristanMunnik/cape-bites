

function RestaurantCard({ restaurant, onSelect }) {
    return (
        <button className="restaurant-card" type="button" onClick={() => onSelect(restaurant.id)}>
            <div className={`card-image ${restaurant.accent}`} aria-hidden="true" />
            <div className="card-content">
                <div className="card-title-row">
                    <h3>{restaurant.name}</h3>
                    <span className="rating">★ {restaurant.rating}</span>
                </div>
                <p className="card-cuisine">{restaurant.cuisine}</p>
                <p className="card-description">{restaurant.description}</p>
                <div className="card-meta">
                    <span>{restaurant.neighborhood}</span>
                    <span>{restaurant.priceRange}</span>
                </div>
            </div>
        </button>
    )
}

export default RestaurantCard

