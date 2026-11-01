import { useState } from 'react'

const stars = [1, 2, 3, 4, 5]

function StarRating({ value, onChange }) {
    const [hovered, setHovered] = useState(0)
    const highlighted = hovered || value

    return (
        <fieldset className="star-rating">
            <legend>Your rating</legend>
            <div className="star-rating-stars" onMouseLeave={() => setHovered(0)}>
                {stars.map((star) => (
                    <label
                        key={star}
                        className={star <= highlighted ? 'is-filled' : ''}
                        onMouseEnter={() => setHovered(star)}
                    >
                        <input
                            checked={value === star}
                            name="rating"
                            onChange={() => onChange(star)}
                            required
                            type="radio"
                            value={star}
                        />
                        <span className="visually-hidden">{star} {star === 1 ? 'star' : 'stars'}</span>
                        <svg aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" />
                        </svg>
                    </label>
                ))}
            </div>
            <p className="star-rating-text" aria-live="polite">
                {value ? `${value} out of 5` : 'Select a rating'}
            </p>
        </fieldset>
    )
}

export default StarRating
