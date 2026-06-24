const pool = require('../db/pool');

class BudgetService {
    async getBudgets(userId, month, year) {
        // 1. Get budgets
        const [budgets] = await pool.execute(
            `SELECT b.*, c.name as category_name 
             FROM budgets b
             LEFT JOIN categories c ON b.category_id = c.id
             WHERE b.user_id = ? AND b.month = ? AND b.year = ?`,
            [userId, month, year]
        );

        // 2. Calculate actual spending for each budget
        const budgetsWithUsage = await Promise.all(budgets.map(async (budget) => {
            let spendingQuery = 'SELECT SUM(amount) as total FROM transactions WHERE user_id = ? AND type = "expense" AND MONTH(transaction_date) = ? AND YEAR(transaction_date) = ?';
            const params = [userId, month, year];

            if (budget.category_id) {
                spendingQuery += ' AND category_id = ?';
                params.push(budget.category_id);
            }

            const [result] = await pool.execute(spendingQuery, params);
            const spent = result[0].total || 0;
            
            return {
                ...budget,
                spent,
                remaining: budget.amount - spent,
                usage_percentage: Math.min((spent / budget.amount) * 100, 100)
            };
        }));

        return budgetsWithUsage;
    }

    async upsertBudget(userId, data) {
        const { category_id, month, year, amount } = data;

        // Use INSERT ... ON DUPLICATE KEY UPDATE for atomic upsert
        await pool.execute(
            `INSERT INTO budgets (user_id, category_id, month, year, amount) 
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE amount = ?`,
            [userId, category_id || null, month, year, amount, amount]
        );

        return { userId, category_id, month, year, amount };
    }

    async deleteBudget(userId, id) {
        const [result] = await pool.execute('DELETE FROM budgets WHERE id = ? AND user_id = ?', [id, userId]);
        if (result.affectedRows === 0) {
            throw new Error('Budget not found');
        }
        return { success: true };
    }
}

module.exports = new BudgetService();
