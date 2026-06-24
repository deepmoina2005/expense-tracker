const categoryService = require('../services/categoryService');
const { categorySchema } = require('../validators/categoryValidator');

const getCategories = async (req, res, next) => {
    try {
        const categories = await categoryService.getAllCategories(req.user.id);
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        next(error);
    }
};

const createCategory = async (req, res, next) => {
    try {
        const validatedData = categorySchema.parse(req.body);
        const category = await categoryService.createCategory(req.user.id, validatedData);
        res.status(201).json({
            success: true,
            category
        });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ success: false, error: error.errors[0].message });
        }
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        await categoryService.deleteCategory(req.user.id, req.params.id);
        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCategories,
    createCategory,
    deleteCategory
};
