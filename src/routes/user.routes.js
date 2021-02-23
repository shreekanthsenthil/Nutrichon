const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
const UserModel = require("../models/User.model");

router.get("/getallusers", userController.getAllUsers);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/getposts", auth, userController.getUserPost);
router.get("/search", auth, userController.searchUserByName);

module.exports = router;
