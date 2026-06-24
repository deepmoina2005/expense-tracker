const transactionService = require('../services/transactionService');
const { transactionSchema } = require('../validators/transactionValidator');

const getTransactions = async (req, res, next) => {
    try {
        const filters = {
            type: req.query.type,
            category_id: req.query.category_id,
            start_date: req.query.start_date,
            end_date: req.query.end_date,
            search: req.query.search,
            sort_by: req.query.sort_by,
            order: req.query.order,
            limit: req.query.limit,
            offset: req.query.offset
        };

        const transactions = await transactionService.getAllTransactions(req.user.id, filters);
        
        res.status(200).json({
            success: true,
            count: transactions.length,
            transactions
        });
    } catch (error) {
        next(error);
    }
};

const createTransaction = async (req, res, next) => {
    try {
        const validatedData = transactionSchema.parse(req.body);
        const transaction = await transactionService.createTransaction(req.user.id, validatedData);
        
        res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            transaction
        });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ success: false, error: error.errors[0].message });
        }
        next(error);
    }
};

const updateTransaction = async (req, res, next) => {
    try {
        const validatedData = transactionSchema.partial().parse(req.body);
        const transaction = await transactionService.updateTransaction(req.user.id, req.params.id, validatedData);
        
        res.status(200).json({
            success: true,
            message: 'Transaction updated successfully',
            transaction
        });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ success: false, error: error.errors[0].message });
        }
        next(error);
    }
};

const deleteTransaction = async (req, res, next) => {
    try {
        await transactionService.deleteTransaction(req.user.id, req.params.id);
        res.status(200).json({
            success: true,
            message: 'Transaction deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction
};
