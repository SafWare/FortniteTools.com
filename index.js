// Add this to your GitHub Pages repository
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors());

app.get('/', async (req, res) => {
  try {
    const response = await fetch('https://api.nitestats.com/v1/epic/lightswitch');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

module.exports = app;
