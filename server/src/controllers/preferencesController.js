const preferencesService = require('../services/preferencesService');

const getPreferences = async (req, res, next) => {
    try {
        const preferences = await preferencesService.getPreferences(req.user.id);
        res.json({ success: true, preferences });
    } catch (error) {
        next(error);
    }
};

const updatePreferences = async (req, res, next) => {
    try {
        await preferencesService.updatePreferences(req.user.id, req.body);
        res.json({ success: true, message: 'Preferences updated successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getPreferences, updatePreferences };
