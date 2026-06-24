const pool = require('../db/pool');

class PreferencesService {
    async getPreferences(userId) {
        const [rows] = await pool.execute(
            'SELECT * FROM user_preferences WHERE user_id = ?',
            [userId]
        );
        return rows[0] || null;
    }

    async updatePreferences(userId, data) {
        // Build dynamic update
        const fields = [];
        const values = [];
        
        if (data.currency) { fields.push('currency = ?'); values.push(data.currency); }
        if (data.theme) { fields.push('theme = ?'); values.push(data.theme); }
        if (data.language) { fields.push('language = ?'); values.push(data.language); }
        if (data.email_notifications !== undefined) { fields.push('email_notifications = ?'); values.push(data.email_notifications); }
        if (data.budget_alerts !== undefined) { fields.push('budget_alerts = ?'); values.push(data.budget_alerts); }

        if (fields.length === 0) return;

        values.push(userId);
        const sql = `UPDATE user_preferences SET ${fields.join(', ')} WHERE user_id = ?`;
        
        await pool.execute(sql, values);
    }

    async ensurePreferences(userId) {
        // Create default preferences if not exist
        const exists = await this.getPreferences(userId);
        if (!exists) {
            await pool.execute(
                'INSERT INTO user_preferences (user_id) VALUES (?) ON DUPLICATE KEY UPDATE user_id = user_id',
                [userId]
            );
        }
    }
}

module.exports = new PreferencesService();
