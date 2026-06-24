const savingsService = require('../services/savingsService');
const { goalSchema } = require('../validators/savingsValidator');

const getGoals = async (req, res, next) => {
    try {
        const goals = await savingsService.getGoals(req.user.id);
        res.status(200).json({ success: true, goals });
    } catch (error) { next(error); }
};

const createGoal = async (req, res, next) => {
    try {
        const validatedData = goalSchema.parse(req.body);
        const goal = await savingsService.createGoal(req.user.id, validatedData);
        res.status(201).json({ success: true, message: 'Goal created successfully', goal });
    } catch (error) {
        if (error.name === 'ZodError') return res.status(400).json({ success: false, error: error.errors[0].message });
        next(error);
    }
};

const updateGoal = async (req, res, next) => {
    try {
        const validatedData = goalSchema.partial().parse(req.body);
        const goal = await savingsService.updateGoal(req.user.id, req.params.id, validatedData);
        res.status(200).json({ success: true, message: 'Goal updated successfully', goal });
    } catch (error) {
        if (error.name === 'ZodError') return res.status(400).json({ success: false, error: error.errors[0].message });
        next(error);
    }
};

const deleteGoal = async (req, res, next) => {
    try {
        await savingsService.deleteGoal(req.user.id, req.params.id);
        res.status(200).json({ success: true, message: 'Goal deleted successfully' });
    } catch (error) { next(error); }
};

module.exports = { getGoals, createGoal, updateGoal, deleteGoal };
