function RestaurantSkeleton() {
    return (
        <>
            <p className="visually-hidden" role="status">Loading restaurants...</p>
            <div className="skeleton-grid" aria-hidden="true">
                {[1, 2, 3].map((item) => (
                    <div className="skeleton-card" key={item}>
                        <div className="skeleton-image" />
                        <div className="skeleton-line" />
                        <div className="skeleton-line is-short" />
                    </div>
                ))}
            </div>
        </>
    )
}

export default RestaurantSkeleton
