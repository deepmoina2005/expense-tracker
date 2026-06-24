const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASS: process.env.DB_PASS || '12345678',
    DB_NAME: process.env.DB_NAME || 'finance_tracker',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
};
