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
router.post("/setheight", auth, userController.setHeight);
router.post("/setweight", auth, userController.setWeight);
router.get("/getweights", auth, userController.getWeights);
router.get("/:id", auth, userController.getUserDataById);

module.exports = router;
