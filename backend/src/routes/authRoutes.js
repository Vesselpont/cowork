const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { actionLogger } = require('../middlewares/logger');

const router = express.Router();
router.post('/register', actionLogger('REGISTRATION'), register);
router.post('/login', actionLogger('LOGIN'), login);
router.get('/me', protect, getMe);
module.exports = router;