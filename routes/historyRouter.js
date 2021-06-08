const express = require("express");
const router = express.Router();
const itemHistoryModel = require("../models/itemHistoryModel");

router.get("/", async (req, res) => {
    if(!req.session.userId) {
        res.redirect("/users/login");
        return;
    }
    try {
        const items = await itemHistoryModel.find({ userId: req.session.userId });
        res.render("itemHistory", { items: items });
    }
    catch(err) {
        res.status(500).send("Unable to fetch the data");
    }
});

module.exports = router;