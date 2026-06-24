const express = require('express');
const { register, login, logout, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);

module.exports = router;
