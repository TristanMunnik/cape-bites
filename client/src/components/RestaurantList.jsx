import RestaurantCard from './RestaurantCard'

function RestaurantList({ restaurants }) {
    if (restaurants.length === 0) {
        return (
            <div className="status-message">
                <h3>No restaurants found</h3>
                <p>Try a different search, or set the cuisine filter back to All.</p>
            </div>
        )
    }

    return (
        <div className="restaurant-grid">
            {restaurants.map((restaurant) => (
                <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}

                />
            ))}
        </div>
    )
}

export default RestaurantList
