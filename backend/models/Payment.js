const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    payment_type: {
        type: String,
        enum: ['topup', 'buy'], // Allowed values for payment_type
        required: true
    },
    payment_status: {
        type: String,
        enum: ['completed', 'pending', 'void'], // Allowed values for payment_type
        required: true
    },
    ref_number: {
        type: String,
        required: false // Not required
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin', // Reference to the Admin model for the creator
        required: false
    },
    createdTime: {
        type: Date,
        default: Date.now // Automatically set to the current date/time
    }
});

// Create the Payment model
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;