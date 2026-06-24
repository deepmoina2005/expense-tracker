const express = require('express');
const { getCategories, createCategory, deleteCategory } = require('../controllers/categoryController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect); // All category routes protected

router.get('/', getCategories);
router.post('/', createCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
