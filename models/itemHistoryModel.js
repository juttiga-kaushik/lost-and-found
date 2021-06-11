const mongoose = require("mongoose");

const itemHistorySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    itemId: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    itemFoundBy: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("itemhistory", itemHistorySchema);