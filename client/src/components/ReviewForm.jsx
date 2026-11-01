import { useState } from 'react'
import { apiRequest } from '../lib/api'

function ReviewForm({ restaurantId, onSubmitted }) {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault()
        setError('')
        setSubmitting(true)

        try {
            await apiRequest(`/restaurants/${restaurantId}/reviews`, {
                method: 'POST',
                body: JSON.stringify({ rating, comment }),
            })
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
            <fieldset className="rating-picker">
                <legend>Your rating</legend>
                {[1, 2, 3, 4, 5].map((value) => (
                    <label key={value}>
                        <input
                            checked={rating === value}
                            name="rating"
                            onChange={() => setRating(value)}
                            required
                            type="radio"
                            value={value}
                        />
                        <span>{value} ★</span>
                    </label>
                ))}
            </fieldset>
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
            <button className="status-button" disabled={submitting} type="submit">
                {submitting ? 'Posting...' : 'Post review'}
            </button>
        </form>
    )
}

export default ReviewForm
