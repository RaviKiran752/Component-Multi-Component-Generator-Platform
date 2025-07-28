const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const auth = require('../middleware/auth');

router.get('/:sessionId', auth, exportController.exportSession);

module.exports = router; 