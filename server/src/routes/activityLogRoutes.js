const express = require('express');
const { getLogs } = require('../controllers/activityLogController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(protect);

router.get('/', getLogs);

module.exports = router;
