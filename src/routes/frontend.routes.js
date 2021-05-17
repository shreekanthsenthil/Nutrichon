const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
    res.render("Login.ejs")
})

router.get("/register", (req, res) => {
    res.render("Register.ejs")
})

router.get("/", (req, res) => {
    res.render('Profile')
})

module.exports = router