const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unitController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);

// Define routes for unit operations
router.post('/', unitController.createUnit); // Create a new unit
router.get('/', unitController.getUnits); // Get all units
router.get('/:id', unitController.getUnitById); // Get a unit by ID
router.put('/:id', unitController.updateUnit); // Update a unit by ID
router.delete('/:id', unitController.deleteUnit); // Delete a unit by ID


module.exports = router;