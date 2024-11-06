const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
    unit_number: {
        type: String,
        required: true,
        unique: true,
    },
    availability: {
        type: Boolean,
        default: true,
    },
    last_parking_route: {
        type: String,
        default: '',
    },
    condition: {
        type: String,
        enum: ['online', 'offline', 'damaged'],
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin', 
        required: true,
    },
    createdTime: {
        type: Date,
        default: Date.now,
    },
});

const Unit = mongoose.model('Unit', unitSchema);

module.exports = Unit;