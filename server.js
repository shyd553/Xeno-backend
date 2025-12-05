require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Allow all origins (for testing)
app.use(cors({ origin: "*" }));
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.send("Xeno Backend is running.");
});

// Load routes
const ingest = require('./src/routes/ingest');
const metrics = require('./src/routes/metrics');

// Register routes
app.use('/ingest', ingest);
app.use('/metrics', metrics);

// Always use Render-assigned PORT
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
