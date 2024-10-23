const axios = require('axios');

const BITQUERY_API_URL = 'https://graphql.bitquery.io/';
const API_KEY = process.env.BITQUERY_API_KEY;

async function getWhaleTransactions() {
    const now = Math.floor(Date.now() / 1000);
    const oneDayAgo = now - (24 * 60 * 60);

    const query = `
        query {
            ethereum(network: bsc) {
                transfers(
                    options: { limit: 10, desc: "amount" }
                    time: { since: "${new Date(oneDayAgo * 1000).toISOString()}" }
                    amount: { gt: 100 }  # Minimum 100 BNB for whale transactions
                    currency: {is: "BNB"}  # Only BNB transfers
                ) {
                    amount
                    currency {
                        symbol
                        decimals
                    }
                    sender {
                        address
                    }
                    receiver {
                        address
                    }
                    block {
                        height
                        timestamp {
                            time(format: "%Y-%m-%d %H:%M:%S")
                        }
                    }
                    transaction {
                        hash
                    }
                }
            }
        }
    `;

    try {
        const response = await axios.post(
            BITQUERY_API_URL,
            { query },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': API_KEY
                }
            }
        );

        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }

        return response.data.data.ethereum.transfers.map(tx => ({
            txHash: tx.transaction.hash,
            amount: parseFloat(tx.amount).toFixed(4), 
            symbol: 'BNB',
            sender: tx.sender.address,
            receiver: tx.receiver.address,
            blockHeight: tx.block.height,
            timestamp: tx.block.timestamp.time
        }));
    } catch (error) {
        console.error('Bitquery API Error:', error.message);
        throw error;
    }
}

module.exports = { getWhaleTransactions };