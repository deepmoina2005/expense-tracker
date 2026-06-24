const budgetService = require('../services/budgetService');
const { budgetSchema } = require('../validators/budgetValidator');

const getBudgets = async (req, res, next) => {
    try {
        const month = req.query.month || new Date().getMonth() + 1;
        const year = req.query.year || new Date().getFullYear();
        
        const budgets = await budgetService.getBudgets(req.user.id, Number(month), Number(year));
        
        res.status(200).json({
            success: true,
            budgets
        });
    } catch (error) {
        next(error);
    }
};

const setBudget = async (req, res, next) => {
    try {
        const validatedData = budgetSchema.parse(req.body);
        const budget = await budgetService.upsertBudget(req.user.id, validatedData);
        
        res.status(200).json({
            success: true,
            message: 'Budget set successfully',
            budget
        });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ success: false, error: error.errors[0].message });
        }
        next(error);
    }
};

const deleteBudget = async (req, res, next) => {
    try {
        await budgetService.deleteBudget(req.user.id, req.params.id);
        res.status(200).json({
            success: true,
            message: 'Budget deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBudgets,
    setBudget,
    deleteBudget
};
