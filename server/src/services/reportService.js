const pool = require('../db/pool');
const fs = require('fs');
const path = require('path');
const activityLogService = require('./activityLogService');

class ReportService {
    async getFullBackup(userId) {
        const [categories] = await pool.execute('SELECT * FROM categories WHERE user_id = ?', [userId]);
        const [transactions] = await pool.execute('SELECT * FROM transactions WHERE user_id = ?', [userId]);
        const [budgets] = await pool.execute('SELECT * FROM budgets WHERE user_id = ?', [userId]);
        const [savings] = await pool.execute('SELECT * FROM savings_goals WHERE user_id = ?', [userId]);
        const [preferences] = await pool.execute('SELECT * FROM user_preferences WHERE user_id = ?', [userId]);
        const [notifications] = await pool.execute('SELECT * FROM notifications WHERE user_id = ?', [userId]);
        const [activityLogs] = await pool.execute('SELECT * FROM activity_logs WHERE user_id = ?', [userId]);

        return {
            metadata: {
                user_id: userId,
                exported_at: new Date().toISOString(),
                version: '1.0'
            },
            data: {
                categories,
                transactions,
                budgets,
                savings_goals: savings,
                preferences,
                notifications,
                activity_logs: activityLogs
            }
        };
    }

    async restoreBackup(userId, backupData) {
        const connection = await pool.getConnection();
        const summary = {
            inserted: 0,
            skipped: 0,
            failed: 0,
            modules: []
        };

        try {
            await connection.beginTransaction();

            const data = backupData.data;

            // 1. Restore Categories (Preserve name + type + user uniqueness)
            if (data.categories) {
                summary.modules.push('categories');
                for (const cat of data.categories) {
                    const [exists] = await connection.execute(
                        'SELECT id FROM categories WHERE user_id = ? AND name = ? AND type = ?',
                        [userId, cat.name, cat.type]
                    );

                    if (exists.length === 0) {
                        await connection.execute(
                            'INSERT INTO categories (user_id, name, type, icon, color, is_default) VALUES (?, ?, ?, ?, ?, ?)',
                            [userId, cat.name, cat.type, cat.icon, cat.color, false]
                        );
                        summary.inserted++;
                    } else {
                        summary.skipped++;
                    }
                }
            }

            // Helper to get category mapping (since IDs change)
            const [currentCats] = await connection.execute('SELECT id, name, type FROM categories WHERE user_id = ? OR is_default = 1', [userId]);
            const catMap = {};
            currentCats.forEach(c => catMap[`${c.name}_${c.type}`] = c.id);

            // 2. Restore Transactions
            if (data.transactions) {
                summary.modules.push('transactions');
                for (const tx of data.transactions) {
                    // Duplicate check: user + amount + type + date + title
                    const [exists] = await connection.execute(
                        'SELECT id FROM transactions WHERE user_id = ? AND amount = ? AND type = ? AND transaction_date = ? AND title = ?',
                        [userId, tx.amount, tx.type, tx.transaction_date, tx.title]
                    );

                    if (exists.length === 0) {
                        // Find matching category ID by name/type from backup
                        const backupCat = data.categories?.find(c => c.id === tx.category_id);
                        const targetCatId = backupCat ? catMap[`${backupCat.name}_${backupCat.type}`] : null;

                        await connection.execute(
                            `INSERT INTO transactions 
                            (user_id, category_id, type, amount, title, note, payment_method, transaction_date, is_recurring, recurring_type, recurring_interval) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            [userId, targetCatId, tx.type, tx.amount, tx.title, tx.note, tx.payment_method, tx.transaction_date, tx.is_recurring, tx.recurring_type, tx.recurring_interval]
                        );
                        summary.inserted++;
                    } else {
                        summary.skipped++;
                    }
                }
            }

            // 3. Restore Budgets
            if (data.budgets) {
                summary.modules.push('budgets');
                for (const b of data.budgets) {
                    const [exists] = await connection.execute(
                        'SELECT id FROM budgets WHERE user_id = ? AND month = ? AND year = ? AND (category_id = ? OR (category_id IS NULL AND ? IS NULL))',
                        [userId, b.month, b.year, b.category_id, b.category_id]
                    );

                    if (exists.length === 0) {
                         await connection.execute(
                            'INSERT INTO budgets (user_id, category_id, amount, month, year) VALUES (?, ?, ?, ?, ?)',
                            [userId, b.category_id, b.amount, b.month, b.year]
                        );
                        summary.inserted++;
                    } else {
                        summary.skipped++;
                    }
                }
            }

            // 4. Restore Savings Goals
            if (data.savings_goals) {
                summary.modules.push('savings_goals');
                for (const s of data.savings_goals) {
                    const [exists] = await connection.execute(
                        'SELECT id FROM savings_goals WHERE user_id = ? AND title = ? AND target_amount = ?',
                        [userId, s.title, s.target_amount]
                    );

                    if (exists.length === 0) {
                        await connection.execute(
                            'INSERT INTO savings_goals (user_id, title, target_amount, current_amount, deadline, status) VALUES (?, ?, ?, ?, ?, ?)',
                            [userId, s.title, s.target_amount, s.current_amount, s.deadline, s.status]
                        );
                        summary.inserted++;
                    } else {
                        summary.skipped++;
                    }
                }
            }

            // 5. Restore Preferences (Update current)
            if (data.preferences) {
                summary.modules.push('preferences');
                const p = data.preferences[0]; // Usually one
                if (p) {
                    await connection.execute(
                        'UPDATE user_preferences SET currency = ?, theme = ?, language = ?, email_notifications = ?, budget_alerts = ? WHERE user_id = ?',
                        [p.currency, p.theme, p.language, p.email_notifications, p.budget_alerts, userId]
                    );
                    summary.inserted++;
                }
            }

            await connection.commit();
            await activityLogService.logAction(userId, 'RESTORE', 'system', null, `Bulk data restoration completed. Modules: ${summary.modules.join(', ')}`);
            return summary;

        } catch (error) {
            await connection.rollback();
            console.error('❌ Restore failed:', error.message);
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = new ReportService();
