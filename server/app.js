const cors = require('cors');
const express = require('express');
const session = require('express-session');
const Restaurant = require('./models/Restaurant');
const User = require('./models/User');
const createAuthRouter = require('./routes/auth');

const sessionCookieName = 'cape_bites.sid';

function createApp({ sessionStore, UserModel = User }) {
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

    app.get('/api/restaurants', async (req, res) => {
        try {
            const restaurants = await Restaurant.find().sort({ rating: -1, name: 1 });
            res.json({ restaurants });
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch restaurants', error: error.message });
        }
    });

    app.get('/api/restaurants/:id', async (req, res) => {
        try {
            const restaurant = await Restaurant.findOne({ id: Number(req.params.id) });

            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            res.json({ restaurant });
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch restaurant', error: error.message });
        }
    });

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
