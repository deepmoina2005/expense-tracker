const notificationService = require('../services/notificationService');

const getNotifications = async (req, res, next) => {
    try {
        const onlyUnread = req.query.unread === 'true';
        const notifications = await notificationService.getNotifications(req.user.id, onlyUnread);
        const unreadCount = await notificationService.getUnreadCount(req.user.id);
        res.json({ success: true, notifications, unreadCount });
    } catch (error) {
        next(error);
    }
};

const markAsRead = async (req, res, next) => {
    try {
        await notificationService.markAsRead(req.user.id, req.params.id);
        res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        next(error);
    }
};

const markAllRead = async (req, res, next) => {
    try {
        await notificationService.markAllAsRead(req.user.id);
        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        next(error);
    }
};

const deleteNotification = async (req, res, next) => {
    try {
        await notificationService.deleteNotification(req.user.id, req.params.id);
        res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getNotifications, markAsRead, markAllRead, deleteNotification };
