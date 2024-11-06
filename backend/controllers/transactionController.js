const Transaction = require('../models/Transaction');
const User = require('../models/User'); 
const Unit = require('../models/Unit');

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    // Fetch the user and unit details
    const user = await User.findById(req.body.user_id);
    const unit = await Unit.findById(req.body.unit_number);

    // Create a new transaction with additional fields
    const transaction = new Transaction({
      ...req.body,
      credit_ride: user.creditRide, // Assign user's creditRide to transaction
      start_park: unit.last_parking_route // Assign unit's last_parking_route to transaction
    });

    await transaction.save();

    // Deduct creditRide by 1 for the user associated with the transaction
    await User.findByIdAndUpdate(user._id, { $inc: { creditRide: -1 } });
     // Update the unit's last_parking_route to the transaction's end_park
    await Unit.findByIdAndUpdate(unit._id, { last_parking_route: transaction.end_park });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('user_id unit_number created_by');
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllTransactionsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you'll pass the user ID as a route parameter
    const transactions = await Transaction.find({ user_id: userId }).populate('unit_number created_by');
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get count of all transactions for a specific user
exports.getTransactionCountByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const count = await Transaction.countDocuments({ user_id: userId });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate('user_id unit_number created_by');
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a transaction by ID
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a transaction by ID
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};