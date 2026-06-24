const express = require('express');
const { getPreferences, updatePreferences } = require('../controllers/preferencesController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(protect);

router.get('/', getPreferences);
router.put('/', updatePreferences);

module.exports = router;
