const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const itemModel = require("../models/itemModel");
const bcrypt = require("bcryptjs");

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {
    const {fullname, email, password, confirmPassword, contactNumber, university} = req.body;
    if(password.length < 6) {
        res.send("Your password is less than 6 characters long");
        return;
    }
    if(password != confirmPassword) {
        res.send("Passwords do not match");
        return;
    }
    try {
        const user = await userModel.findOne({"email": email});
        if(user != null) {
            res.send("User already exists with this email id");
            return;
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new userModel({fullname: fullname, email: email, password: hashedPassword, contactNumber: contactNumber, university: university});
        await newUser.save();
        res.send("User created successfully. <a href='/users/login'>Login</a>");
    }
    catch(err) {
        res.status(500).send("Error in creating an account");
    }
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", async (req, res) => {
    try {
        const user = await userModel.findOne({"email":req.body.email});
        if(user != null) {
            if(await bcrypt.compare(req.body.password, user.password)) {
                req.session.userId = user.id;
                res.redirect("/home");
                return;
            }
            else {
                res.send("Incorrect password");
                return;
            }
        }
        else {
            res.send("User doesn't exist. <a href='/users/register'>Register</a>");
            return;
        }
    }
    catch(err) {
        res.status(500).send("Error in verifying your account");
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.send("Logged out successfully. <a href='/users/login'>Login</a>");
    return;
});

router.get("/:userId", async (req, res) => {
    if(!req.session.userId) {
        res.redirect("/users/login");
        return;
    }
    try {
        const user = await userModel.findById(req.params.userId);
        res.render("userInfo", {user:user});
    }
    catch(err) {
        res.status(500).send("Error in fetching the data");
    }
});

router.post("/edit", async (req,res) => {
    if(!req.session.userId) {
        res.redirect("/users/login");
        return;
    }
    try {
        const user = await userModel.findById(req.session.userId);
        if(req.body.contactNumber) {
            user.contactNumber = req.body.contactNumber;
            await user.save();
            res.redirect("/home");
            return;
        }
        if(req.body.oldPassword) {
            const {oldPassword, newPassword, confirmNewPassword} = req.body;
            if(await bcrypt.compare(oldPassword, user.password)) {
                if(newPassword.length < 6) {
                    res.send("Your password is less than 6 characters long");
                    return;
                }
                if(newPassword != confirmNewPassword) {
                    res.send("Passwords do not match");
                    return;
                }
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                user.password = hashedPassword;
                await user.save();
                res.redirect("/home");
                return;
            }
            else {
                res.send("Old password is wrong");
                return;
            }
        }
        return;
    }
    catch(err) {
        res.status(500).send("Error in editing the data");
    }
});

module.exports = router;