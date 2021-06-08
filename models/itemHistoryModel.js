const mongoose = require("mongoose");

const itemHistorySchema = new mongoose.Schema({
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
    university: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("itemhistory", itemHistorySchema);