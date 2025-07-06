const express = require('express');
const cors = require('cors');
const path = require('path');

// Import upload route
const uploadRoute = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// === Middleware ===
app.use(cors());
app.use(express.json());

// === Routes ===
app.use('/api', uploadRoute); // all routes in upload.js are now under /api

// === Health check route ===
app.get('/', (req, res) => {
  res.send('Backend server is running.');
});

// === Start server ===
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
