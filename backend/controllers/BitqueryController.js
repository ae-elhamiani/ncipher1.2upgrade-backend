const cron = require('node-cron');
let cronJob = null;

const { getWhaleTransactions } = require('../services/BitqueryService');

async function fetchWhaleTransactions(req, res) {
    try {
        const transactions = await getWhaleTransactions();
        
        if (!transactions || transactions.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No whale transactions found in the last 24 hours',
                data: [],
                count: 0
            });
        }

        res.status(200).json({
            success: true,
            data: transactions,
            count: transactions.length,
            message: 'Successfully retrieved whale transactions'
        });
    } catch (error) {
        console.error('Controller Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching whale transactions',
            error: error.message
        });
    }
}

function setCronInterval(req, res) {
    const { minutes } = req.body;
    
    if (!minutes || minutes < 1) {
        return res.status(400).json({
            success: false,
            message: 'Invalid interval. Please provide a value greater than 0.'
        });
    }

    try {
        if (cronJob) {
            cronJob.stop();
        }

        const cronExpression = `*/${minutes} * * * *`;

        cronJob = cron.schedule(cronExpression, async () => {
            console.log(`Fetching whale transactions every ${minutes} minutes`);
            await getWhaleTransactions();
        });

        res.status(200).json({
            success: true,
            message: `Cron job set to run every ${minutes} minutes`
        });
    } catch (error) {
        console.error('Cron Setup Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error setting up cron job',
            error: error.message
        });
    }
}

module.exports = { 
    fetchWhaleTransactions,
    setCronInterval
};