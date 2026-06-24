const express = require('express');
const { getBackup, restoreBackup } = require('../controllers/reportController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();
router.use(protect);

router.get('/backup', getBackup);
router.post('/restore', restoreBackup);

module.exports = router;
