const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const pool = require('../db/pool');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get user from db
        const [users] = await pool.execute(
            'SELECT id, full_name, email FROM users WHERE id = ?',
            [decoded.id]
        );

        if (!users[0]) {
            return res.status(401).json({ success: false, error: 'User no longer exists' });
        }

        req.user = users[0];
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }
};

module.exports = { protect };
