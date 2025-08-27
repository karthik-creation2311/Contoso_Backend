const express = require('express');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Nile Portal Backend is running.' });
});

// Example placeholder route
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the Nile Portal Backend API.' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Nile Portal Backend API listening on port ${PORT}`);
});

module.exports = app;