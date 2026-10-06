const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/optionalAuthMiddleware');
const { handleChatMessage } = require('../controllers/chatController');

// @desc    Process AI Chat message
// @route   POST /api/chat/message
// @access  Public / Optional Auth (Logged in required for order status queries)
router.post('/message', optionalAuth, handleChatMessage);

module.exports = router;
