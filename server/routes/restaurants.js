const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const updateRatingSummary = require('../lib/updateRatingSummary');

function createRestaurantsRouter({ Restaurant, Review }) {
    const router = express.Router();

    async function findRestaurant(req, res) {
        const id = Number(req.params.id);
        const restaurant = Number.isInteger(id) ? await Restaurant.findOne({ id }) : null;

        if (!restaurant) {
            res.status(404).json({ message: 'Restaurant not found' });
        }

        return restaurant;
    }

    router.get('/', async (req, res, next) => {
        try {
            const restaurants = await Restaurant.find().sort({ rating: -1, name: 1 });
            res.json({ restaurants });
        } catch (error) {
            next(error);
        }
    });

    router.get('/:id', async (req, res, next) => {
        try {
            const restaurant = await findRestaurant(req, res);
            if (restaurant) res.json({ restaurant });
        } catch (error) {
            next(error);
        }
    });

    router.get('/:id/reviews', async (req, res, next) => {
        try {
            const restaurant = await findRestaurant(req, res);
            if (!restaurant) return;

            const reviews = await Review.find({ restaurant: restaurant._id })
                .sort({ createdAt: -1 })
                .populate('user', 'username');
            res.json({ reviews });
        } catch (error) {
            next(error);
        }
    });

    router.post('/:id/reviews', requireAuth, async (req, res, next) => {
        try {
            const restaurant = await findRestaurant(req, res);
            if (!restaurant) return;

            const { rating, comment = '' } = req.body || {};

            if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
                return res.status(400).json({ message: 'Rating must be a whole number from 1 to 5.' });
            }

            if (typeof comment !== 'string' || comment.length > 1000) {
                return res.status(400).json({ message: 'Comment must be 1000 characters or fewer.' });
            }

            const review = await Review.create({
                restaurant: restaurant._id,
                user: req.session.userId,
                rating,
                comment,
            });
            await updateRatingSummary({ Restaurant, Review }, restaurant._id);

            res.status(201).json({ review });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({ message: 'You have already reviewed this restaurant.' });
            }
            next(error);
        }
    });

    return router;
}

module.exports = createRestaurantsRouter;
