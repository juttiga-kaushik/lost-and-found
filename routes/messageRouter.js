const express = require("express");
const router = express.Router();
const itemStatusModel = require("../models/itemStatusModel");

router.get("/", async (req, res) => {
    if(!req.session.userId) {
        res.redirect("/users/login");
        return;
    }
    try {
        const messages = await itemStatusModel.find({ itemOwnerId: req.session.userId });
        res.render("messages", { messages: messages });
        return;
    }
    catch(err) {
        console.log(err);
        res.status(500).send("Error in fetching the data");
    }
});

module.exports = router;