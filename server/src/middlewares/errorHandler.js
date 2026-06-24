const { NODE_ENV } = require('../config/env');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console for dev
    if (NODE_ENV === 'development') {
        console.error(err);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
        stack: NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = { errorHandler };
