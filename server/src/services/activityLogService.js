const pool = require('../db/pool');

class ActivityLogService {
    async logAction(userId, action, entityType, entityId, description) {
        try {
            await pool.execute(
                'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description) VALUES (?, ?, ?, ?, ?)',
                [userId, action, entityType, entityId, description]
            );
        } catch (error) {
            console.error('❌ Failed to log activity:', error.message);
        }
    }

    async getLogs(userId, limit = 50) {
        const parsedLimit = Math.max(1, parseInt(limit, 10) || 50);
        const [logs] = await pool.execute(
            `SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ${parsedLimit}`,
            [userId]
        );
        return logs;
    }
}

module.exports = new ActivityLogService();
