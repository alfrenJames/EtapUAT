const mongoose = require('mongoose');

const notificationMessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    notif_type: {
        type: String,
        required: true,
        enum: ['info', 'warning', 'promotion'] // Added categories for message_type
    },
    notif_status: {
        type: String,
        required: true,
        enum: ['open', 'closed'] // Added categories for message_status
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId, // Reference to admin._id
        ref: 'Admin', // Assuming the admin model is named 'Admin'
        required: true
    },
    createdtime: {
        type: Date,
        default: Date.now
    }
});

const NotificationMessage = mongoose.model('NotificationMessage', notificationMessageSchema);

module.exports = NotificationMessage;