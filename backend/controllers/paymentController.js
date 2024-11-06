const Payment = require('../models/Payment');
const User = require('../models/User');
const mongoose = require('mongoose');
// Create a new payment
const createPayment = async (req, res) => {
    try {
        const { user_id, amount, ref_number, createdBy } = req.body;

        const newPayment = new Payment({
            user_id,
            amount,
            payment_type: "topup", // Set payment_type to "topup"
            ref_number,
            payment_status: "pending", // Set payment_status to "pending" initially
            createdBy,
            createdTime: Date.now()
        });

        await newPayment.save();
        
        // Note: User's credit amount will not be updated here since payment_status is "pending"

        res.status(201).json(newPayment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating payment', error: error.message });
    }
};

// Function to update payment status to "completed"
const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params;

        // Validate the paymentId format
        if (!mongoose.Types.ObjectId.isValid(paymentId)) {
            console.log(paymentId);
            return res.status(400).json({ message: 'Invalid payment ID format' });
        }

        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Check if the payment status is currently "pending"
        if (payment.payment_status === "pending") {
            payment.payment_status = "completed"; // Update payment status to "completed"
            await payment.save();

            // Update user's credit amount
            await User.findByIdAndUpdate(payment.user_id, { $inc: { creditAmount: payment.amount } });

            return res.status(200).json({ message: 'Payment status updated to completed', payment });
        } else {
            return res.status(400).json({ message: 'Payment status is not pending' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment status', error: error.message });
    }
};


// Create a new buy payment
const createBuyPayment = async (req, res) => {
    try {
        const { user_id, amount, createdBy } = req.body;

        // Generate a unique ref_number
        const ref_number = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

        const newPayment = new Payment({
            user_id,
            amount,
            payment_type: "buy", // Set payment_type to "buy"
            ref_number,
            payment_status: "completed", 
            createdBy,
            createdTime: Date.now()
        });

        await newPayment.save();
        
        // Deduct user's credit amount
        await User.findByIdAndUpdate(user_id, { $inc: { creditAmount: -amount } });
        
        // Update user's creditRide based on the amount deducted
        const creditOptions = [
            { amount: 100, rides: 20 },
            { amount: 80, rides: 15 },
            { amount: 60, rides: 10 },
            { amount: 40, rides: 5 }
        ];
        
        const creditOption = creditOptions.find(option => option.amount === amount);
        if (creditOption) {
            await User.findByIdAndUpdate(user_id, { $inc: { creditRide: creditOption.rides } });
        }

        res.status(201).json(newPayment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating buy payment', error: error.message });
    }
};
// Get all payments
const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('user_id', 'firstName lastName') // Populate user details
            .populate('createdBy', 'firstName lastName'); // Populate creator details

            const totalPayments = await Payment.countDocuments();

            // Get completed payments
            const completedPayments = await Payment.countDocuments({ payment_status: 'completed' });
        
            // Get pending payments
            const pendingPayments = await Payment.countDocuments({ payment_status: 'pending' });
       
            // Send response with counts
    res.status(200).json({
        total: totalPayments,
        completed: completedPayments,
        pending: pendingPayments,
        payments
      });
    } catch (error) {
      console.error('Error fetching payment counts:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

const editPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { amount, payment_type, ref_number } = req.body; // Add any other fields you want to allow editing

        // Validate the paymentId format
        if (!mongoose.Types.ObjectId.isValid(paymentId)) {
            return res.status(400).json({ message: 'Invalid payment ID format' });
        }

        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Check if payment status is "pending"
        if (payment.payment_status !== "pending") {
            return res.status(400).json({ message: 'Payment status must be pending to edit' });
        }

        // Update payment details
        payment.amount = amount !== undefined ? amount : payment.amount; // Update amount if provided
        payment.payment_type = payment_type !== undefined ? payment_type : payment.payment_type; // Update payment_type if provided
        payment.ref_number = ref_number !== undefined ? ref_number : payment.ref_number; // Update ref_number if provided

        await payment.save();

        res.status(200).json({ message: 'Payment updated successfully', payment });
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment', error: error.message });
    }
};
module.exports = {
    createPayment,
    getPayments,
    createBuyPayment,
    updatePaymentStatus,
    editPayment
};