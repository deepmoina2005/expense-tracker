const pool = require('../db/pool');

class SavingsService {
    async getGoals(userId) {
        const [goals] = await pool.execute(
            'SELECT * FROM savings_goals WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return goals;
    }

    async createGoal(userId, data) {
        const { title, target_amount, current_amount, deadline } = data;
        const [result] = await pool.execute(
            'INSERT INTO savings_goals (user_id, title, target_amount, current_amount, deadline) VALUES (?, ?, ?, ?, ?)',
            [userId, title, target_amount, current_amount || 0, deadline || null]
        );
        return { id: result.insertId, ...data };
    }

    async updateGoal(userId, id, data) {
        const fields = [];
        const params = [];
        Object.keys(data).forEach(key => {
            if (['title', 'target_amount', 'current_amount', 'deadline'].includes(key)) {
                fields.push(`${key} = ?`);
                params.push(data[key]);
            }
        });
        if (fields.length === 0) return null;
        params.push(id, userId);
        const query = `UPDATE savings_goals SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
        await pool.execute(query, params);
        return { id, ...data };
    }

    async deleteGoal(userId, id) {
        const [result] = await pool.execute('DELETE FROM savings_goals WHERE id = ? AND user_id = ?', [id, userId]);
        if (result.affectedRows === 0) throw new Error('Goal not found');
        return { success: true };
    }
}

module.exports = new SavingsService();
