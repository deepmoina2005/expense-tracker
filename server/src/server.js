const app = require('./app');
const { PORT } = require('./config/env');
const { initRecurringJob } = require('./jobs/recurringJob');
const { initializeDatabase } = require('./db/init');

const startServer = async () => {
    try {
        // 1. Ensure Database is ready
        await initializeDatabase();

        // 2. Start Express Server
        app.listen(PORT, () => {
            console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`);
            
            // 3. Start background jobs
            initRecurringJob();
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
});
