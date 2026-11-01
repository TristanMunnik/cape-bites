// Returns an error message for an invalid review, or null when it is valid.
function validateReview({ rating, comment }) {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return 'Rating must be a whole number from 1 to 5.';
    }

    if (typeof comment !== 'string' || comment.length > 1000) {
        return 'Comment must be 1000 characters or fewer.';
    }

    return null;
}

module.exports = validateReview;
