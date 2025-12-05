require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const ingest = require('./src/routes/ingest');
const metrics = require('./src/routes/metrics');

app.use('/ingest', ingest);
app.use('/metrics', metrics);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
