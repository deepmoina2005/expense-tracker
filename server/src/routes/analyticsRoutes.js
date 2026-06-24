const express = require('express');
const { getDashboardData, getAnalyticsData } = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardData);
router.get('/trends', getAnalyticsData);

module.exports = router;
