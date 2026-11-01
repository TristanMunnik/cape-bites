const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const updateRatingSummary = require('../lib/updateRatingSummary');

function createReviewsRouter({ Restaurant, Review }) {
    const router = express.Router();

    router.delete('/:reviewId', requireAuth, async (req, res, next) => {
        try {
            const review = await Review.findById(req.params.reviewId);

            if (!review) {
                return res.status(404).json({ message: 'Review not found' });
            }

            if (review.user.toString() !== req.session.userId) {
                return res.status(403).json({ message: 'You can only delete your own reviews.' });
            }

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
