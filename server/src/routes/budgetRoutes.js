const express = require('express');
const { getBudgets, setBudget, deleteBudget } = require('../controllers/budgetController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getBudgets);
router.post('/', setBudget);
router.delete('/:id', deleteBudget);

module.exports = router;
