import { useState } from 'react'
import { apiRequest } from '../lib/api'
import StarRating from './StarRating'

function ReviewForm({ restaurantId, review, onSubmitted, onCancel }) {
    const isEdit = Boolean(review)
    const [rating, setRating] = useState(review?.rating ?? 0)
    const [comment, setComment] = useState(review?.comment ?? '')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault()
        setError('')
        setSubmitting(true)

        try {
            await apiRequest(
                isEdit ? `/reviews/${review._id}` : `/restaurants/${restaurantId}/reviews`,
                {
                    method: isEdit ? 'PUT' : 'POST',
                    body: JSON.stringify({ rating, comment }),
                }
            )
            setRating(0)
            setComment('')
            await onSubmitted()
        } catch (requestError) {
            setError(requestError.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form className="review-form" onSubmit={handleSubmit}>
            <StarRating value={rating} onChange={setRating} />
            <label className="review-comment-field">
                Your review (optional)
                <textarea
                    maxLength={1000}
                    onChange={(event) => setComment(event.target.value)}
                    rows={4}
                    value={comment}
                />
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="review-form-actions">
                <button className="status-button" disabled={submitting} type="submit">
                    {submitting ? 'Saving...' : isEdit ? 'Save changes' : 'Post review'}
                </button>
                {onCancel && (
                    <button className="review-cancel" onClick={onCancel} type="button">
                        Cancel
                    </button>
                )}
            </div>
        </form>
    )
}

export default ReviewForm
