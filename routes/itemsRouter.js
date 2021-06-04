const express = require("express");
const router = express.Router();
const cloudinary = require("../cloudinary");
const fs = require("fs");
const itemModel = require("../models/itemModel");
const userModel = require("../models/userModel");

router.post("/lost", async (req,res) => {
    if(!req.session.userId) {
        res.redirect("/users/login");
        return;
    }
    try {
        const { itemName, itemDescription, itemReward, university } = req.body;
        var imageUrl = "";
        var imagePublicId = "";
        if(req.files != null) {
            const result = await cloudinary.uploader.upload(req.files.image.tempFilePath);
            imageUrl = result.secure_url;
            imagePublicId = result.public_id;
            await fs.unlinkSync(req.files.image.tempFilePath, (err) => {
                if(err) {
                    console.log("Temp file was not deleted successfully");
                }
            });
        }
        else {
            imageUrl = "none";
            imagePublicId = "none";
        }
        const newItem = new itemModel({
            userId: req.session.userId,
            itemName: itemName,
            itemDescription: itemDescription,
            itemReward: itemReward,
            itemImage: imageUrl,
            cloudinaryId: imagePublicId,
            university: university
        });
        await newItem.save();
        res.redirect("/home");
    }
    catch(err) {
        console.log(err);
    }
});

router.get("/:itemId", async (req,res) => {
    if(!req.session.userId) {
        res.redirect("/users/login");
        return;
    }
    try {
        const item = await itemModel.findById(req.params.itemId);
        const user = await userModel.findById(item.userId);
        res.render("itemInfo",{item:item,user:user});
    }
    catch(err) {
        res.send(err);
    }
});

router.get("/delete/:itemId", async (req,res) => {
    if(!req.session.userId) {
        res.redirect("/users/login");
        return;
    }
    try {
        const item = await itemModel.findById(req.params.itemId);
        if(item.cloudinaryId != "none") {
            await cloudinary.uploader.destroy(item.cloudinaryId);
        }
        await item.remove();
        res.redirect("/home");
    }
    catch(err) {
        res.send(err);
    }
});

module.exports = router;