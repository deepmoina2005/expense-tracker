const pool = require('../db/pool');

class NotificationService {
    async createNotification(userId, title, message, type = 'info') {
        try {
            const [result] = await pool.execute(
                'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
                [userId, title, message, type]
            );
            return result.insertId;
        } catch (error) {
            console.error('❌ Failed to create notification:', error.message);
        }
    }

    async getNotifications(userId, onlyUnread = false) {
        let sql = 'SELECT * FROM notifications WHERE user_id = ?';
        if (onlyUnread) sql += ' AND is_read = 0';
        sql += ' ORDER BY created_at DESC LIMIT 100';
        
        const [notifications] = await pool.execute(sql, [userId]);
        return notifications;
    }

    async markAsRead(userId, notificationId) {
        await pool.execute(
            'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
            [notificationId, userId]
        );
    }

    async markAllAsRead(userId) {
        await pool.execute(
            'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
            [userId]
        );
    }

    async getUnreadCount(userId) {
        const [rows] = await pool.execute(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
            [userId]
        );
        return rows[0].count;
    }

    async deleteNotification(userId, notificationId) {
        await pool.execute(
            'DELETE FROM notifications WHERE id = ? AND user_id = ?',
            [notificationId, userId]
        );
    }
}

module.exports = new NotificationService();
