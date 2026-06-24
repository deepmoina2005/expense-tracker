const express = require('express');
const { getTransactions, createTransaction, updateTransaction, deleteTransaction } = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getTransactions);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
