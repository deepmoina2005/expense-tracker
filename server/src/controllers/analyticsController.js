const analyticsService = require('../services/analyticsService');

const getDashboardData = async (req, res, next) => {
    try {
        const data = await analyticsService.getDashboardSummary(req.user.id);
        const insights = await analyticsService.getSmartInsights(req.user.id);
        
        res.status(200).json({
            success: true,
            ...data,
            insights
        });
    } catch (error) {
        next(error);
    }
};

const getAnalyticsData = async (req, res, next) => {
    try {
        const { year } = req.query;
        const trends = await analyticsService.getMonthlyTrends(req.user.id, year);
        
        res.status(200).json({
            success: true,
            trends
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardData,
    getAnalyticsData
};
