require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const repoRoutes = require('./routes/repoRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/repo', repoRoutes);
app.use('/api/chat', chatRoutes);

// Base route for testing
app.get('/', (req, res) => {
  res.send('RepoChat AI Backend is running.');
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error', error: err.message });
});

// Only listen if we are not running in a serverless environment (Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

// Export for serverless (Vercel)
module.exports = app;
