const transactionService = require('../services/transactionService');

const runRecurringJob = async () => {
    try {
        await transactionService.processRecurringTransactions();
        console.log('🕒 Recurring transactions processing completed.');
    } catch (error) {
        console.error('❌ Error in recurring transaction job:', error.message);
    }
};

// Run every hour (3600000ms)
const initRecurringJob = () => {
    // Initial run on server start
    runRecurringJob();
    
    // Set interval
    setInterval(runRecurringJob, 3600 * 1000); 
};

module.exports = { initRecurringJob };
