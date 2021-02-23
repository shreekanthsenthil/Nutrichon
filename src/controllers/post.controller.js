const mongoose = require("mongoose");

const Post = require("../models/Post.model");
const User = require("../models/User.model");

exports.newPost = (req, res, next) => {
  const post = new Post({
    _id: mongoose.Types.ObjectId(),
    ...req.body,
    userId: req.userData.userId,
  });
  post
    .save()
    .then((data) => {
      User.updateOne(
        { _id: req.userData.userId },
        { $push: { posts: post._id } }
      )
        .then((data2) => res.status(200).json(data))
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};
