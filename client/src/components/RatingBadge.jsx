function RatingBadge({ restaurant }) {
    if (restaurant.rating == null) {
        return <span className="rating">No reviews</span>
    }

    return (
        <span className="rating">
            ★ {restaurant.rating}
            <span className="rating-count"> ({restaurant.reviewCount})</span>
        </span>
    )
}

export default RatingBadge
