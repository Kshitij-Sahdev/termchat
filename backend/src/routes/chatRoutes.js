const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

// All chat routes are protected
router.use(auth);

// Chat room management
router.get('/public', chatController.getPublicChats);
router.post('/', chatController.createChat);
router.post('/:chatId/join', chatController.joinChat);
router.post('/:chatId/leave', chatController.leaveChat);

// Messages
router.get('/:chatId/messages', chatController.getMessages);
router.post('/:chatId/messages', chatController.sendMessage);

module.exports = router;