const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/User.model");

exports.register = (req, res, next) => {
  //   console.log(req.body);
  User.find({
    email: req.body.email,
  })
    .then((data) => {
      //   console.log(data);
      if (data.length >= 1) {
        return res.status(409).json({
          message: "User exsits!",
        });
      } else {
        bcrypt.hash(req.body.password, 8, async (err, hash) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              ...req.body,
              password: hash,
            });
            user
              .save()
              .then((data) => {
                res.status(200).json(data);
              })
              .catch((err) => {
                res.status(500).json(err);
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        error: err,
      });
    });
};

exports.login = (req, res, next) => {
  User.find({
    $or: [
      {
        email: req.body.email,
      },
    ],
  })
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed!",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_SECRET || "key"
          );
          res.cookie("jwt", token, {
            httpOnly: true,
          });
          let responseUser = {
            ...user[0]._doc,
          };
          delete responseUser["password"];
          return res.send(responseUser);
        }
        return res.status(401).json({
          message: "Auth failed!",
        });
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({
        error: "something went wrong!",
      });
    });
};

exports.getUserPost = async (req, res, next) => {
  try {
    const posts = await User.findOne({ _id: req.userData.userId })
      .select("posts")
      .populate("posts")
      .exec();
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    let users = await User.find({});
    users = users.map((user) => {
      user.password = undefined;
      return user;
    });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    let user = await User.findById(req.body.userId).exec();
    user.password = undefined;
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.searchUserByName = async (req, res, next) => {
  try {
    let searchTerm = req.body.searchTerm;
    let users = await User.find({
      $or: [
        { firstName: { $regex: ".*" + searchTerm + ".*" } },
        { lastName: { $regex: ".*" + searchTerm + ".*" } },
        { email: { $regex: ".*" + searchTerm + ".*" } },
      ],
    }).select("firstName lastName email");
    // console.log(users);
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
