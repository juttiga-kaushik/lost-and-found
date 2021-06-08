const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const itemModel = require("../models/itemModel");

router.get("/", async (req,res) => {
    if(!req.session.userId) {
        res.redirect("/users/login");
        return;
    }
    try {
        const userInfo = await userModel.findById(req.session.userId);
        const items = await itemModel.find({ university: userInfo.university });
        const userItems = await itemModel.find({userId:req.session.userId});
        res.render("home",{userInfo:userInfo, items:items, userItems:userItems});
    }
    catch(err) {
        res.status(500).send("Unable to fetch the data");
    }
});

module.exports = router;