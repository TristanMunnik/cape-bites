import ReviewForm from './ReviewForm'

function wasEdited(review) {
    return new Date(review.updatedAt) - new Date(review.createdAt) > 1000
}

function ReviewList({
    reviews,
    currentUserId,
    editingId,
    deletingId,
    confirmingId,
    onAskDelete,
    onCancelDelete,
    onEdit,
    onCancelEdit,
    onSaved,
    onDelete,
}) {
    if (reviews.length === 0) {
        return <p>No reviews yet. Be the first!</p>
    }

    return (
        <ul className="review-list">
            {reviews.map((review) => (
                <li className="review-item" key={review._id}>
                    {editingId === review._id ? (
                        <ReviewForm review={review} onSubmitted={onSaved} onCancel={onCancelEdit} />
                    ) : (
                        <>
                            <div className="review-header">
                                <strong>{review.user?.username ?? 'Deleted user'}</strong>
                                <span className="rating" aria-label={`${review.rating} out of 5`}>
                                    ★ {review.rating}
                                </span>
                                <time dateTime={review.createdAt}>
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </time>
                                {wasEdited(review) && <span className="review-edited">(edited)</span>}
                                {review.isSample && <span className="review-sample">Sample</span>}
                            </div>
                            {review.comment && <p className="review-comment">{review.comment}</p>}
                            {review.user?._id === currentUserId && (
                                confirmingId === review._id ? (
                                    <div className="review-confirm" role="alert">
                                        <span>Are you sure you want to delete this review?</span>
                                        <button
                                            className="review-confirm-delete"
                                            disabled={deletingId === review._id}
                                            onClick={() => onDelete(review._id)}
                                            type="button"
                                        >
                                            {deletingId === review._id ? 'Deleting...' : 'Yes, delete'}
                                        </button>
                                        <button
                                            disabled={deletingId === review._id}
                                            onClick={onCancelDelete}
                                            type="button"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="review-actions">
                                        <button onClick={() => onEdit(review._id)} type="button">
                                            Edit
                                        </button>
                                        <button onClick={() => onAskDelete(review._id)} type="button">
                                            Delete
                                        </button>
                                    </div>
                                )
                            )}
                        </>
                    )}
                </li>
            ))}
        </ul>
    )
}

export default ReviewList
