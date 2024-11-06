const Unit = require('../models/Unit');
const axios = require('axios');
// Create a new unit
exports.createUnit = async (req, res) => {
    try {
        // Create a new unit with the request body and set createdBy to the admin's ID
        const unit = new Unit({
            ...req.body,
            createdBy: req.admin._id, // Assuming req.user contains the authenticated user's info
            last_parking_route: "Route 01"
        });
        await unit.save();
        res.status(201).send(unit);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};

// Get all units
exports.getUnits = async (req, res) => {
    try {
        const units = await Unit.find().populate('createdBy', 'username'); // Populate createdBy with username
        res.status(200).send(units);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a unit by ID
exports.getUnitById = async (req, res) => {
    try {
        const unit = await Unit.findById(req.params.id);
        if (!unit) {
            return res.status(404).send();
        }
        res.status(200).send(unit);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a unit by ID
exports.updateUnit = async (req, res) => {
    try {
        const unit = await Unit.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!unit) {
            return res.status(404).send();
        }
        res.status(200).send(unit);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a unit by ID
exports.deleteUnit = async (req, res) => {
    try {
        const unit = await Unit.findByIdAndDelete(req.params.id);
        if (!unit) {
            return res.status(404).send();
        }
        res.status(200).send(unit);
    } catch (error) {
        res.status(500).send(error);
    }
};

