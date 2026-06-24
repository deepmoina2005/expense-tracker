const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const savingsRoutes = require('./routes/savingsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const activityLogRoutes = require('./routes/activityLogRoutes');
const preferencesRoutes = require('./routes/preferencesRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Use Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/budgets', budgetRoutes);
app.use('/api/v1/savings', savingsRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/activity-logs', activityLogRoutes);
app.use('/api/v1/preferences', preferencesRoutes);
app.use('/api/v1/reports', reportRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;
