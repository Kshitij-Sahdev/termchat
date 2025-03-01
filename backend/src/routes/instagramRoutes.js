const express = require('express');
const router = express.Router();
const instagramController = require('../controllers/instagramController');
const auth = require('../middleware/auth');

// All Instagram routes are protected
router.use(auth);

router.get('/auth-url', instagramController.getAuthUrl);
router.post('/connect', instagramController.connect);
router.get('/status', instagramController.getStatus);
router.post('/disconnect', instagramController.disconnect);
router.get('/followers', instagramController.getFollowers);
router.post('/direct-messages', instagramController.sendDirectMessage);

module.exports = router;