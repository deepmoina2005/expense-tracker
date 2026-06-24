const pool = require('../db/pool');
const { addDays, addWeeks, addMonths, addYears, format, isAfter, parseISO } = require('date-fns');
const activityLogService = require('./activityLogService');
const notificationService = require('./notificationService');

class TransactionService {
    async getAllTransactions(userId, filters = {}) {
        const { type, category_id, start_date, end_date, search, sort_by = 'transaction_date', order = 'DESC', limit = 50, offset = 0 } = filters;

        let query = `
            SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon 
            FROM transactions t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = ?
        `;
        const params = [userId];

        if (type) {
            query += ' AND t.type = ?';
            params.push(type);
        }
        if (category_id) {
            query += ' AND t.category_id = ?';
            params.push(category_id);
        }
        if (start_date) {
            query += ' AND t.transaction_date >= ?';
            params.push(start_date);
        }
        if (end_date) {
            query += ' AND t.transaction_date <= ?';
            params.push(end_date);
        }
        if (search) {
            query += ' AND (t.title LIKE ? OR t.note LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        // Sorting
        const allowedSortFields = ['transaction_date', 'amount', 'title', 'created_at'];
        const finalSortBy = allowedSortFields.includes(sort_by) ? sort_by : 'transaction_date';
        const finalOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const parsedLimit = Math.max(1, parseInt(limit, 10) || 50);
        const parsedOffset = Math.max(0, parseInt(offset, 10) || 0);
        query += ` ORDER BY t.${finalSortBy} ${finalOrder} LIMIT ${parsedLimit} OFFSET ${parsedOffset}`;

        const [transactions] = await pool.execute(query, params);
        return transactions;
    }

    async createTransaction(userId, data) {
        const { category_id, type, amount, title, note, payment_method, transaction_date, is_recurring, recurring_type, recurring_interval } = data;
        
        let next_recurring_date = null;
        if (is_recurring) {
            next_recurring_date = this.calculateNextDate(transaction_date, recurring_type, recurring_interval);
        }

        const [result] = await pool.execute(
            `INSERT INTO transactions 
            (user_id, category_id, type, amount, title, note, payment_method, transaction_date, is_recurring, recurring_type, recurring_interval, next_recurring_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, category_id, type, Number(amount), title, note, payment_method || 'Cash', transaction_date, is_recurring || false, recurring_type || null, recurring_interval || 1, next_recurring_date]
        );

        // Record activity
        await activityLogService.logAction(userId, 'CREATE', 'transaction', result.insertId, `Added ${type}: ${title} (${amount})`);

        // Check budget if it's an expense
        if (type === 'expense') {
            this.checkBudgetAlert(userId, category_id, transaction_date);
        }

        return { id: result.insertId, ...data, next_recurring_date };
    }

    async checkBudgetAlert(userId, categoryId, dateStr) {
        try {
            const date = new Date(dateStr);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            // 1. Find relevant budget (Specific category or Global)
            const [budgets] = await pool.execute(
                `SELECT * FROM budgets 
                 WHERE user_id = ? AND month = ? AND year = ? 
                 AND (category_id = ? OR category_id IS NULL)
                 ORDER BY category_id DESC LIMIT 1`, // Specific category budget takes priority
                [userId, month, year, categoryId]
            );

            if (budgets.length > 0) {
                const budget = budgets[0];
                
                // 2. Calculate current spending for this budget's scope
                let spendSql = 'SELECT SUM(amount) as total FROM transactions WHERE user_id = ? AND type = "expense" AND MONTH(transaction_date) = ? AND YEAR(transaction_date) = ?';
                const spendParams = [userId, month, year];
                
                if (budget.category_id) {
                    spendSql += ' AND category_id = ?';
                    spendParams.push(budget.category_id);
                }

                const [spendRows] = await pool.execute(spendSql, spendParams);
                const currentSpend = spendRows[0].total || 0;

                // 3. Compare and Notify
                if (currentSpend > budget.amount) {
                    const scope = budget.category_id ? 'category' : 'total monthly';
                    await notificationService.createNotification(
                        userId,
                        'Budget Exceeded! ⚠️',
                        `You have spent $${currentSpend.toLocaleString()} which exceeds your ${scope} budget of $${Number(budget.amount).toLocaleString()}.`,
                        'warning'
                    );
                } else if (currentSpend > budget.amount * 0.8) {
                    const scope = budget.category_id ? 'category' : 'total monthly';
                    await notificationService.createNotification(
                        userId,
                        'Budget Warning 🔔',
                        `You have reached 80% of your ${scope} budget.`,
                        'info'
                    );
                }
            }
        } catch (error) {
            console.error('❌ Budget alert check failed:', error.message);
        }
    }

    async updateTransaction(userId, id, data) {
        const fields = [];
        const params = [];
        
        Object.keys(data).forEach(key => {
            if (['category_id', 'type', 'amount', 'title', 'note', 'payment_method', 'transaction_date', 'is_recurring', 'recurring_type', 'recurring_interval'].includes(key)) {
                fields.push(`${key} = ?`);
                params.push(data[key]);
            }
        });

        if (fields.length === 0) return null;

        params.push(id, userId);
        const query = `UPDATE transactions SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
        
        await pool.execute(query, params);
        await activityLogService.logAction(userId, 'UPDATE', 'transaction', id, `Updated transaction: ${data.title || id}`);
        
        if (data.type === 'expense' || data.amount) {
             const [tx] = await pool.execute('SELECT transaction_date, category_id FROM transactions WHERE id = ?', [id]);
             if (tx[0]) this.checkBudgetAlert(userId, tx[0].category_id, tx[0].transaction_date);
        }
        
        return { id, ...data };
    }

    async deleteTransaction(userId, id) {
        const [result] = await pool.execute('DELETE FROM transactions WHERE id = ? AND user_id = ?', [id, userId]);
        if (result.affectedRows === 0) {
            const err = new Error('Transaction not found');
            err.statusCode = 404;
            throw err;
        }
        await activityLogService.logAction(userId, 'DELETE', 'transaction', id, `Deleted transaction ID: ${id}`);
        return { success: true };
    }

    async processRecurringTransactions() {
        console.log('🔄 Checking for due recurring transactions...');
        const today = format(new Date(), 'yyyy-MM-dd');
        
        const [dueTransactions] = await pool.execute(
            'SELECT * FROM transactions WHERE is_recurring = TRUE AND next_recurring_date <= ?',
            [today]
        );

        for (const trans of dueTransactions) {
            const connection = await pool.getConnection();
            try {
                await connection.beginTransaction();

                const newDate = trans.next_recurring_date;
                const [result] = await connection.execute(
                    `INSERT INTO transactions 
                    (user_id, category_id, type, amount, title, note, payment_method, transaction_date, is_recurring, last_generated_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, FALSE, CURRENT_TIMESTAMP)`,
                    [trans.user_id, trans.category_id, trans.type, trans.amount, trans.title, `[Auto-generated] ${trans.note || ''}`, trans.payment_method, newDate]
                );

                const nextDate = this.calculateNextDate(newDate, trans.recurring_type, trans.recurring_interval);
                await connection.execute(
                    'UPDATE transactions SET next_recurring_date = ?, last_generated_at = CURRENT_TIMESTAMP WHERE id = ?',
                    [nextDate, trans.id]
                );

                await connection.commit();
                
                await activityLogService.logAction(trans.user_id, 'RECURRING', 'transaction', result.insertId, `Auto-generated transaction: ${trans.title}`);
                this.checkBudgetAlert(trans.user_id, trans.category_id, newDate);

            } catch (error) {
                await connection.rollback();
                console.error(`❌ Failed to generate recurring transaction ID ${trans.id}:`, error.message);
            } finally {
                connection.release();
            }
        }
    }

    calculateNextDate(currentDate, type, interval = 1) {
        const date = parseISO(currentDate);
        let nextDate;
        switch (type) {
            case 'daily': nextDate = addDays(date, interval); break;
            case 'weekly': nextDate = addWeeks(date, interval); break;
            case 'monthly': nextDate = addMonths(date, interval); break;
            case 'yearly': nextDate = addYears(date, interval); break;
            default: nextDate = date;
        }
        return format(nextDate, 'yyyy-MM-dd');
    }
}

module.exports = new TransactionService();
