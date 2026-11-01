function ReviewList({ reviews, currentUserId, onDelete, deletingId }) {
    if (reviews.length === 0) {
        return <p>No reviews yet. Be the first!</p>
    }

    return (
        <ul className="review-list">
            {reviews.map((review) => (
                <li className="review-item" key={review._id}>
                    <div className="review-header">
                        <strong>{review.user?.username ?? 'Deleted user'}</strong>
                        <span className="rating" aria-label={`${review.rating} out of 5`}>
                            ★ {review.rating}
                        </span>
                        <time dateTime={review.createdAt}>
                            {new Date(review.createdAt).toLocaleDateString()}
                        </time>
                    </div>
                    {review.comment && <p className="review-comment">{review.comment}</p>}
                    {review.user?._id === currentUserId && (
                        <button
                            className="review-delete"
                            disabled={deletingId === review._id}
                            onClick={() => onDelete(review._id)}
                            type="button"
                        >
                            Delete my review
                        </button>
                    )}
                </li>
            ))}
        </ul>
    )
}

export default ReviewList
