require('dotenv').config();

const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const { createApp } = require('./app');

const port = process.env.PORT || 5000;

async function startServer() {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be set before starting the server.');
    }

    if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
        throw new Error('SESSION_SECRET must contain at least 32 characters.');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const sessionStore = MongoStore.create({
        clientPromise: Promise.resolve(mongoose.connection.getClient()),
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60,
    });
    const app = createApp({ sessionStore });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

startServer().catch((error) => {
    console.error('Server startup failed:', error.message);
    process.exit(1);
});
