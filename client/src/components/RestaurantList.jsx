import RestaurantCard from './RestaurantCard'

function RestaurantList({ restaurants, onSelect }) {
    if (restaurants.length === 0) {
        return <p>No restaurants found.</p>
    }

    return (
        <div className="restaurant-grid">
            {restaurants.map((restaurant) => (
                <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onSelect={onSelect}
                />
            ))}
        </div>
    )
}

export default RestaurantList
