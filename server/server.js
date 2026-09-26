require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Restaurant = require('./models/Restaurant');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

startServer();

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

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
