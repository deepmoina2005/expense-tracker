const reportService = require('../services/reportService');

const getBackup = async (req, res, next) => {
    try {
        const backup = await reportService.getFullBackup(req.user.id);
        res.json({ success: true, backup });
    } catch (error) {
        next(error);
    }
};

const restoreBackup = async (req, res, next) => {
    try {
        const summary = await reportService.restoreBackup(req.user.id, req.body);
        res.json({ success: true, summary, message: 'Restore completed successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getBackup, restoreBackup };
