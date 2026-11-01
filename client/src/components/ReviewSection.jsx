import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { apiRequest } from '../lib/api'
import ReviewForm from './ReviewForm'
import ReviewList from './ReviewList'

function ReviewSection({ restaurantId, onReviewsChange }) {
    const { user } = useAuth()
    const location = useLocation()
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [deletingId, setDeletingId] = useState('')
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
        async function loadReviews() {
            try {
                const data = await apiRequest(`/restaurants/${restaurantId}/reviews`)
                setReviews(data.reviews)
                setError('')
            } catch {
                setError('Could not load reviews.')
            } finally {
                setLoading(false)
            }
        }

        loadReviews()
    }, [restaurantId, reloadKey])

    function handleChanged() {
        setReloadKey((key) => key + 1)
        onReviewsChange()
    }

    async function handleDelete(reviewId) {
        if (!window.confirm('Delete your review?')) return

        setDeletingId(reviewId)
        try {
            await apiRequest(`/reviews/${reviewId}`, { method: 'DELETE' })
            handleChanged()
        } catch (requestError) {
            setError(requestError.message)
        } finally {
            setDeletingId('')
        }
    }

    const alreadyReviewed = reviews.some((review) => review.user?._id === user?.id)

    return (
        <section className="reviews" aria-labelledby="reviews-heading">
            <h3 id="reviews-heading">Reviews</h3>

            {user ? (
                alreadyReviewed ? (
                    <p>Thanks, you have reviewed this restaurant.</p>
                ) : (
                    <ReviewForm restaurantId={restaurantId} onSubmitted={handleChanged} />
                )
            ) : (
                <p>
                    <Link to="/login" state={{ from: location.pathname }}>Sign in</Link> to leave a review.
                </p>
            )}

            {loading ? (
                <p>Loading reviews...</p>
            ) : (
                <>
                    {error && <p className="form-error" role="alert">{error}</p>}
                    <ReviewList
                        reviews={reviews}
                        currentUserId={user?.id}
                        onDelete={handleDelete}
                        deletingId={deletingId}
                    />
                </>
            )}
        </section>
    )
}

export default ReviewSection
