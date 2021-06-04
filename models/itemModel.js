const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    itemDescription: {
        type: String,
        required: true
    },
    itemReward: {
        type: Number,
        required: true
    },
    itemImage: {
        type: String,
        required: true
    },
    cloudinaryId: {
        type: String,
        required: true
    },
    university: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("item", itemSchema);