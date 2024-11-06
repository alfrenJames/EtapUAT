// path/to/controllers/notificationController.js

const NotificationMessage = require('../models/Notification'); // Adjust the path as necessary

// Create a new notification message
exports.createNotification = async (req, res) => {
    try {
        const notification = new NotificationMessage(req.body);
        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Get all notification messages with open status
exports.getAllOpenNotifications = async (req, res) => {
    try {
        const notifications = await NotificationMessage.find({ notif_status: "open" })
            .populate('created_by')
            .sort({ createdAt: -1 }); // Optional: sort by creation date, newest first
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all notification messages
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await NotificationMessage.find().populate('created_by');
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single notification message by ID
exports.getNotificationById = async (req, res) => {
    try {
        const notification = await NotificationMessage.findById(req.params.id).populate('created_by');
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a notification message by ID
exports.updateNotification = async (req, res) => {
    try {
        const notification = await NotificationMessage.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.status(200).json(notification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a notification message by ID
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await NotificationMessage.findByIdAndDelete(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ... existing code ...