const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true
  },
  unit_number: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit', // Reference to Unit model
    required: true
  },
  start_park: {
    type: String,
    required: true,
    enum: [
        'Route 01', 'Route 02','Route 03', 
        'Route 04', 'Route 05', 'Route 06', 
        'Route 07', 'Route 08', 'Route 09', 
        'Route 10', 'Route 11']
  },
  end_park: {
    type: String,
    required: true,
    enum: [
        'Route 01', 'Route 02','Route 03', 
        'Route 04', 'Route 05', 'Route 06', 
        'Route 07', 'Route 08', 'Route 09', 
        'Route 10', 'Route 11']
  },
  credit_ride: {
    type: Number,
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'created_by_model', // Dynamic reference to either Admin or User
    required: true
  },
  created_by_model: {
    type: String,
    required: true,
    enum: ['Admin', 'User'] // Must be either 'Admin' or 'User'
  },
  created_time: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;