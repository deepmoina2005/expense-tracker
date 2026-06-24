const mysql = require('mysql2/promise');
const config = require('../config/env');

const pool = mysql.createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASS,
    database: config.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL Database connected successfully.');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }
})();

module.exports = pool;