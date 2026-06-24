const express = require('express');
const { getGoals, createGoal, updateGoal, deleteGoal } = require('../controllers/savingsController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getGoals);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

module.exports = router;
