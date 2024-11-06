// path/to/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController'); // Adjust the path as necessary

// Create a new notification
router.post('/', notificationController.createNotification);

// Get all notifications
router.get('/', notificationController.getAllNotifications);

// Get all notifications by status
router.get('/status', notificationController.getAllOpenNotifications);

// Get a notification by ID
router.get('/:id', notificationController.getNotificationById);

// Update a notification by ID
router.put('/:id', notificationController.updateNotification);

// Delete a notification by ID
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;

// ... existing code ...