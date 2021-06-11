const mongoose = require("mongoose");

const itemStatusSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    itemOwnerId: {
        type: String,
        required: true
    },
    itemFoundUserId: {
        type: String,
        required: true
    },
    itemFoundUserName: {
        type: String,
        required: true
    },
    itemFoundUserContact: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("itemstatus", itemStatusSchema);