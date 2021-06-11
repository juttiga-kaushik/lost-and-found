const express = require("express");
const router = express.Router();
const itemStatusModel = require("../models/itemStatusModel");
const itemModel = require("../models/itemModel");
const userModel = require("../models/userModel");
const itemHistoryModel = require("../models/itemHistoryModel");

router.get("/:itemId/", async (req, res) => {
    if(!req.session.userId) {
        res.redirect("/users/login");
        return;
    }
    try {
        const itemStatusDoc = await itemStatusModel.findOne({ itemId: req.params.itemId });
        if(itemStatusDoc) {
            res.send("Someone already sent a message to the owner that they found the item");
            return;
        }
        const itemInfo = await itemModel.findById(req.params.itemId);
        const userInfo = await userModel.findById(req.session.userId);
        const itemStatus = new itemStatusModel({
            itemId: itemInfo.id,
            itemName: itemInfo.itemName,
            itemOwnerId: itemInfo.userId,
            itemFoundUserId: userInfo.id,
            itemFoundUserName: userInfo.fullname,
            itemFoundUserContact: userInfo.contactNumber
        });
        await itemStatus.save();
        res.send("Message sent to the owner. Owner will verify whether his item found or not");
        return;
    }
    catch(err) {
        console.log(err);
        res.status(500).send("Error in uploading the data");
    }
});

router.get("/confirm/:itemStatusId/:itemId", async (req, res) => {
    if(!req.session.userId) {
        res.redirect("/users/login");
        return;
    }
    try { 
        const itemStatus = await itemStatusModel.findById(req.params.itemStatusId);
        const newItemHistory = new itemHistoryModel({
            userId: req.session.userId,
            itemId: req.params.itemId, 
            itemName: itemStatus.itemName, 
            itemFoundBy: itemStatus.itemFoundUserName
        });
        await newItemHistory.save();
        await itemStatus.remove();
        await itemModel.findByIdAndRemove(req.params.itemId);
        res.redirect("/messages/");
        return;
    }
    catch(err) {
        console.log(err);
        res.status(500).send("Error in deleting the data");
    }
});

router.get("/reject/:itemStatusId", async (req, res) => {
    if(!req.session.userId) {
        res.redirect("/users/login");
        return;
    }
    try {
        await itemStatusModel.findByIdAndRemove(req.params.itemStatusId);
        res.redirect("/messages/");
        return;
    }
    catch(err) {
        console.log(err);
        res.status(500).send("Error in deleting the data");
    }
});

module.exports = router;