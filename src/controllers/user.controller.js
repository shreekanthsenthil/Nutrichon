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

exports.setHeight = async (req, res, next) => {
  try {
    let height = req.body.height;
    let date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    console.log(date);
    let update = await User.updateOne(
      { _id: req.userData.userId, "heights.date": date },
      { $set: { heights: { height: height } } }
    );
    if (update.n == 0) {
      await User.updateOne(
        { _id: req.userData.userId },
        { $push: { heights: { date: date, height: height } } }
      );
    }
    res.status(200).json({});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getUserDataById = async (req, res, next) => {
  try {
    console.log(req.params.id);
    let user = await User.findOne({ _id: req.params.id })
      .populate("posts")
      .exec();
    console.log(user);
    // if (user != null) user.password = undefined;
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.setWeight = async (req, res, next) => {
  try {
    let weight = req.body.weight;
    let date = new Date(2022, 03, 25)
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");
    let update = await User.updateOne(
      { _id: req.userData.userId, "weights.date": date },
      { $set: { weights: { weight: weight } } }
    );
    if (update.n == 0) {
      await User.updateOne(
        { _id: req.userData.userId },
        { $push: { weights: { date: date, weight: weight } } }
      );
    }
    res.status(200).json({ message: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getWeights = async (req, res, next) => {
  try {
    let weights = await User.find({ _id: req.userData.userId })
      .select("weights")
      .sort([["weights.date", 1]]) //SORTING NOT WORKING
      .limit(10)
      .exec();
    console.log(weights);
    res.status(200).json(weights);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
