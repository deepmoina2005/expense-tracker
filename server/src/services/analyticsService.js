const pool = require('../db/pool');

class AnalyticsService {
    async getDashboardSummary(userId) {
        // 1. Total Income & Expense (All time or current month?) - Let's do Current Month
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const [totals] = await pool.execute(`
            SELECT 
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
            FROM transactions 
            WHERE user_id = ? AND MONTH(transaction_date) = ? AND YEAR(transaction_date) = ?
        `, [userId, currentMonth, currentYear]);

        const income = totals[0].total_income || 0;
        const expense = totals[0].total_expense || 0;
        const savings = income - expense;

        // 2. Recent Transactions
        const [recent] = await pool.execute(`
            SELECT t.*, c.name as category_name, c.color as category_color 
            FROM transactions t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = ?
            ORDER BY transaction_date DESC, created_at DESC
            LIMIT 5
        `, [userId]);

        // 3. Category-wise breakdown (Current Month)
        const [categoryBreakdown] = await pool.execute(`
            SELECT c.name, SUM(t.amount) as total, c.color
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = ? AND t.type = 'expense' 
            AND MONTH(t.transaction_date) = ? AND YEAR(t.transaction_date) = ?
            GROUP BY c.id
            ORDER BY total DESC
        `, [userId, currentMonth, currentYear]);

        return {
            summary: { income, expense, savings, balance: savings },
            recentTransactions: recent,
            categoryBreakdown
        };
    }

    async getMonthlyTrends(userId, year) {
        const [trends] = await pool.execute(`
            SELECT 
                MONTH(transaction_date) as month,
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
            FROM transactions
            WHERE user_id = ? AND YEAR(transaction_date) = ?
            GROUP BY MONTH(transaction_date)
            ORDER BY month ASC
        `, [userId, year || new Date().getFullYear()]);

        return trends;
    }

    async getSmartInsights(userId) {
        const insights = [];
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        // 1. Highest Expense Category
        const [highestExpense] = await pool.execute(`
            SELECT c.name, SUM(t.amount) as total
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = ? AND t.type = 'expense' 
            AND MONTH(t.transaction_date) = ? AND YEAR(t.transaction_date) = ?
            GROUP BY c.id
            ORDER BY total DESC
            LIMIT 1
        `, [userId, currentMonth, currentYear]);

        if (highestExpense[0]) {
            insights.push({
                type: 'info',
                title: 'Highest Spending',
                message: `You've spent the most on ${highestExpense[0].name} this month ($${highestExpense[0].total}).`
            });
        }

        // 2. Spending Spike Detection (Compared to previous month)
        const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

        const [comparisons] = await pool.execute(`
            SELECT 
                (SELECT SUM(amount) FROM transactions WHERE user_id = ? AND type = 'expense' AND MONTH(transaction_date) = ? AND YEAR(transaction_date) = ?) as current_total,
                (SELECT SUM(amount) FROM transactions WHERE user_id = ? AND type = 'expense' AND MONTH(transaction_date) = ? AND YEAR(transaction_date) = ?) as prev_total
        `, [userId, currentMonth, currentYear, userId, prevMonth, prevYear]);

        const currentTotal = comparisons[0].current_total || 0;
        const prevTotal = comparisons[0].prev_total || 0;

        if (prevTotal > 0 && currentTotal > prevTotal * 1.2) {
            insights.push({
                type: 'warning',
                title: 'Spending Spike',
                message: `Your spending this month is ${Math.round(((currentTotal - prevTotal) / prevTotal) * 100)}% higher than last month.`
            });
        }

        // 3. Budget Alerts (Handled in Budget Service usually, but can be added here)

        return insights;
    }
}

module.exports = new AnalyticsService();
