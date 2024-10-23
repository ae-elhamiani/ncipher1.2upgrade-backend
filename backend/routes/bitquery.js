const express = require('express');
const router = express.Router();
const { fetchWhaleTransactions, setCronInterval } = require('../controllers/BitqueryController');

router.get('/whale-transactions', fetchWhaleTransactions);
router.post('/set-interval', setCronInterval);

module.exports = router;