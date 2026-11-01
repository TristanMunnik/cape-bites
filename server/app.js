const cors = require('cors');
const express = require('express');
const session = require('express-session');
const Restaurant = require('./models/Restaurant');
const Review = require('./models/Review');
const User = require('./models/User');
const createAuthRouter = require('./routes/auth');
const createRestaurantsRouter = require('./routes/restaurants');
const createReviewsRouter = require('./routes/reviews');

const sessionCookieName = 'cape_bites.sid';

function createApp({
    sessionStore,
    UserModel = User,
    RestaurantModel = Restaurant,
    ReviewModel = Review,
}) {
    if (!sessionStore) {
        throw new Error('A persistent session store is required.');
    }

    const app = express();
    const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    };

    if (process.env.NODE_ENV === 'production') {
        app.set('trust proxy', 1);
    }

    app.use(cors({ origin: clientOrigin, credentials: true }));
    app.use(express.json({ limit: '10kb' }));
    app.use(
        session({
            name: sessionCookieName,
            secret: process.env.SESSION_SECRET,
            store: sessionStore,
            resave: false,
            saveUninitialized: false,
            cookie: { ...cookieOptions, maxAge: 14 * 24 * 60 * 60 * 1000 },
        })
    );

    app.get('/api/health', (req, res) => {
        res.json({ status: 'ok' });
    });

    app.use('/api/auth', createAuthRouter({
        User: UserModel,
        sessionCookieName,
        cookieOptions,
    }));

    const models = { Restaurant: RestaurantModel, Review: ReviewModel };
    app.use('/api/restaurants', createRestaurantsRouter(models));
    app.use('/api/reviews', createReviewsRouter(models));

    app.use((error, req, res, next) => {
        if (error.type === 'entity.parse.failed') {
            return res.status(400).json({ message: 'Request body must contain valid JSON.' });
        }
        console.error('Request failed:', error);
        res.status(500).json({ message: 'Unexpected server error' });
    });

    return app;
}

module.exports = { createApp };
