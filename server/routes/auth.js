const bcrypt = require('bcryptjs');
const express = require('express');

const usernamePattern = /^[a-zA-Z0-9_-]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function publicUser(user) {
    return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
    };
}

function regenerateSession(req) {
    return new Promise((resolve, reject) => {
        req.session.regenerate((error) => (error ? reject(error) : resolve()));
    });
}

function saveSession(req) {
    return new Promise((resolve, reject) => {
        req.session.save((error) => (error ? reject(error) : resolve()));
    });
}

function createAuthRouter({ User, sessionCookieName, cookieOptions }) {
    const router = express.Router();

    router.get('/me', async (req, res, next) => {
        try {
            if (!req.session.userId) {
                return res.json({ user: null });
            }

            const user = await User.findById(req.session.userId);
            if (!user) {
                await new Promise((resolve, reject) => {
                    req.session.destroy((error) => (error ? reject(error) : resolve()));
                });
                return res.json({ user: null });
            }

            res.json({ user: publicUser(user) });
        } catch (error) {
            next(error);
        }
    });

    router.post('/register', async (req, res, next) => {
        const { username, email, password } = req.body || {};
        const normalizedUsername = typeof username === 'string' ? username.trim().toLowerCase() : '';
        const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
        const passwordBytes = typeof password === 'string' ? Buffer.byteLength(password, 'utf8') : 0;

        if (
            normalizedUsername.length < 3 ||
            normalizedUsername.length > 24 ||
            !usernamePattern.test(normalizedUsername)
        ) {
            return res.status(400).json({
                message: 'Username must be 3-24 characters using letters, numbers, underscores, or hyphens.',
            });
        }

        if (
            normalizedEmail.length > 254 ||
            !emailPattern.test(normalizedEmail)
        ) {
            return res.status(400).json({ message: 'Enter a valid email address.' });
        }

        if (passwordBytes < 8 || passwordBytes > 72) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters and no more than 72 UTF-8 bytes.',
            });
        }

        try {
            const passwordHash = await bcrypt.hash(password, 12);
            const user = await User.create({
                username: normalizedUsername,
                email: normalizedEmail,
                passwordHash,
            });

            await regenerateSession(req);
            req.session.userId = user._id.toString();
            await saveSession(req);

            res.status(201).json({ user: publicUser(user) });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    message: 'That username or email is already registered.',
                });
            }
            next(error);
        }
    });

    router.post('/login', async (req, res, next) => {
        const { email, password } = req.body || {};
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        try {
            const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
            const passwordMatches = user && await bcrypt.compare(password, user.passwordHash);

            if (!passwordMatches) {
                return res.status(401).json({ message: 'Email or password is incorrect.' });
            }

            await regenerateSession(req);
            req.session.userId = user._id.toString();
            await saveSession(req);

            res.json({ user: publicUser(user) });
        } catch (error) {
            next(error);
        }
    });

    router.post('/logout', async (req, res, next) => {
        try {
            if (req.session) {
                await new Promise((resolve, reject) => {
                    req.session.destroy((error) => (error ? reject(error) : resolve()));
                });
            }

            res.clearCookie(sessionCookieName, cookieOptions);
            res.json({ message: 'Signed out.' });
        } catch (error) {
            next(error);
        }
    });

    return router;
}

module.exports = createAuthRouter;
