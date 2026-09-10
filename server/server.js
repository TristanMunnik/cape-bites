const express = require('express');
const app = express();
const cors = require('cors')

const port = 5000

app.use(cors())

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.get('/api/restaurants', (req, res) => {
    res.json({ restaurants })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})