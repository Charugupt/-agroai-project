const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    disease: {
        type: String,
        required: true
    },
    confidence: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Scan', scanSchema);
