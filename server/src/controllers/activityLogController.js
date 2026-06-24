const activityLogService = require('../services/activityLogService');

const getLogs = async (req, res, next) => {
    try {
        const logs = await activityLogService.getLogs(req.user.id, req.query.limit);
        res.json({ success: true, logs });
    } catch (error) {
        next(error);
    }
};

module.exports = { getLogs };
