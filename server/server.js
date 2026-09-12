const express = require('express');
const app = express();
const cors = require('cors')
const restaurants = require('./data/restaurants')

const port = 5000

app.use(cors())

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.get('/api/restaurants', (req, res) => {
    res.json({ restaurants })
})

app.get('/api/restaurants/:id', (req, res) => {
    const restaurantId = Number(req.params.id)
    const restaurant = restaurants.find((item) => item.id === restaurantId)

    if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' })
    }

    res.json({ restaurant })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})