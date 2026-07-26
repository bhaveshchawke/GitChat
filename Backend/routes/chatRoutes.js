const express = require('express');
const { askQuestion } = require('../controllers/chatController');

const router = express.Router();

// POST /api/chat/ask
router.post('/ask', askQuestion);

module.exports = router;
