const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const updateRatingSummary = require('../lib/updateRatingSummary');
const validateReview = require('../lib/validateReview');

function createReviewsRouter({ Restaurant, Review }) {
    const router = express.Router();

    // Finds a review and checks the signed-in user owns it. Sends the error response itself.
    async function findOwnReview(req, res, action) {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            res.status(404).json({ message: 'Review not found' });
            return null;
        }

        if (review.user.toString() !== req.session.userId) {
            res.status(403).json({ message: `You can only ${action} your own reviews.` });
            return null;
        }

        return review;
    }

    router.put('/:reviewId', requireAuth, async (req, res, next) => {
        try {
            const { rating, comment = '' } = req.body || {};
            const validationError = validateReview({ rating, comment });

            if (validationError) {
                return res.status(400).json({ message: validationError });
            }

            const review = await findOwnReview(req, res, 'edit');
            if (!review) return;

            review.rating = rating;
            review.comment = comment;
            await review.save();
            await updateRatingSummary({ Restaurant, Review }, review.restaurant);

            res.json({ review });
        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(404).json({ message: 'Review not found' });
            }
            next(error);
        }
    });

    router.delete('/:reviewId', requireAuth, async (req, res, next) => {
        try {
            const review = await findOwnReview(req, res, 'delete');
            if (!review) return;

            await review.deleteOne();
            await updateRatingSummary({ Restaurant, Review }, review.restaurant);

            res.json({ message: 'Review deleted.' });
        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(404).json({ message: 'Review not found' });
            }
            next(error);
        }
    });

    return router;
}

module.exports = createReviewsRouter;
