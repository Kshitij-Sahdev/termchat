const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsappController');
const auth = require('../middleware/auth');

// All WhatsApp routes are protected
router.use(auth);

router.post('/connect', whatsappController.connect);
router.get('/status', whatsappController.getStatus);
router.post('/disconnect', whatsappController.disconnect);
router.get('/contacts', whatsappController.getContacts);
router.post('/messages', whatsappController.sendMessage);

module.exports = router;