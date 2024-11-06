const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Create a new transaction
router.post('/', transactionController.createTransaction);

// Get all transactions by user ID
router.get('/user/:userId', transactionController.getAllTransactionsByUserId);

// Get count of all transactions for a specific user
router.get('/user/:userId/count', transactionController.getTransactionCountByUser);

// Get all transactions
router.get('/', transactionController.getAllTransactions);

// Get a single transaction by ID
router.get('/:id', transactionController.getTransactionById);

// Update a transaction by ID
router.put('/:id', transactionController.updateTransaction);

// Delete a transaction by ID
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;