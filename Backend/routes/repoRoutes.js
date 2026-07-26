const express = require('express');
const { ingestRepo } = require('../controllers/repoController');

const router = express.Router();

// POST /api/repo/ingest
router.post('/ingest', ingestRepo);

module.exports = router;
