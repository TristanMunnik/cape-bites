import { useState } from "react"

function RestaurantImage({ restaurant, className, loading }) {
    const [failed, setFailed] = useState(false)

    return (
        <div className={`${className} ${restaurant.accent}`} aria-hidden="true">
            {restaurant.image && !failed && (
                <img
                    src={restaurant.image}
                    alt=""
                    loading={loading}
                    onError={() => setFailed(true)}
                />
            )}
        </div>
    )
}

export default RestaurantImage
