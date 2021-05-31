const mongoose = require("mongoose");

const Post = require("../models/Post.model");
const User = require("../models/User.model");

exports.newPost = (req, res, next) => {
  let date = new Date()
    date.setHours(6)
    date = date
      .toLocaleDateString()
  const post = new Post({
    _id: mongoose.Types.ObjectId(),
    ...req.body,
    date: date,
    userId: req.userData.userId,
    userName: req.userData.name
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

exports.getAllPosts = async (req, res) => {
  const posts = await Post.find({})
  // console.log(posts);
  res.json(posts)
}

exports.getAllPostsData = async() => {
  const posts = await Post.find({})
  return posts
}