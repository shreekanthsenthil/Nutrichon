const express = require("express");
const router = express.Router();

const postController = require("../controllers/post.controller");
const auth = require("../middlewares/auth");

router.post("/newpost", auth, postController.newPost);

module.exports = router;
