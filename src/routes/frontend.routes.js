const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth")
const userController = require('../controllers/user.controller')
const postController = require('../controllers/post.controller')

router.get("/login", (req, res) => {
    res.render("Login.ejs")
})

router.get("/register", (req, res) => {
    res.render("Register.ejs")
})

router.get("/", (req, res) => {
    if(req.cookies.jwt) res.redirect('/home')
    res.render('Welcome.ejs', {errors: ['HELLO ERROR']})
})

router.get('/home', auth, async (req, res) => {
    let posts = await postController.getAllPostsData()
    // console.log(posts);
    res.render('Home.ejs', {posts: posts})
})

router.get('/aboutus', (req, res) => {
    res.render('AboutUs.ejs')
})

router.get('/profile', auth, async (req, res) => {
    let user = await userController.getUserById(req.userData.userId)
    console.log(user);
    res.render('Profile.ejs', {user: user})
})

module.exports = router