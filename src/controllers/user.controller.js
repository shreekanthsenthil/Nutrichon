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
        req.flash('errors', 'User Already exits try Logining In')
        res.redirect('/login')
        // return res.status(409).json({
        //   message: "User exsits!",
        // });
      } else {
        bcrypt.hash(req.body.password, 8, async (err, hash) => {
          if (err) {
            console.log(err);
            req.flash('errors', err)
            return res.redirect('/register')
            // return res.status(500).json({
            //   error: err,
            // });
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              ...req.body,
              password: hash,
            });
            user
              .save()
              .then((user) => {
                // req.flash('errors', err)
                // console.log(data)
                const token = jwt.sign(
                  {
                    email: user.email,
                    userId: user._id,
                  },
                  process.env.JWT_SECRET || "key"
                );
                res.cookie("jwt", token, {
                  httpOnly: true,
                });
                return res.redirect('/home')
                // res.status(200).json(data);
              })
              .catch((err) => {
                req.flash('errors', err)
                return res.redirect('/register')
                // res.status(500).json(err);
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      req.flash('errors', 'Something Went Wrong Please Try Again')
      return res.redirect('/register')
      // res.status(500).send({
      //   error: err,
      // });
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
        req.flash('errors', 'User Not Found')
        res.redirect('/login')
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
              name: user[0].name
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
          return res.redirect('/home')
        }
        req.flash('errors', 'Invalid Password')
        return res.redirect('/login')
      });
    })
    .catch((e) => {
      console.log(e);
      req.flash('errors', "Something Went Wrong Please Try again")
      res.redirect('/login')
    });
};

exports.updateUser = async (req, res, next) => {
  const updatedUser = {
    ...req.body
  }
  delete updatedUser.password
  req.body.password = req.body.password.trim()
  let password = undefined
  if(req.body.password !== ""){
    password = await new Promise((resolve, reject) => {
      bcrypt.hash(req.body.password, 8, function(err, hash){
        if(err) reject(err)
        resolve(hash)
      })
    })
    updatedUser.password = password
  }
  
  await User.updateOne({_id: req.userData.userId}, updatedUser)
  res.json('Success')
}

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

exports.getUserById = async (userId) => {
  try {
    let user = await User.findById(userId).exec();
    user.password = undefined;
    return user
    // res.status(200).json(user);
  } catch (err) {
    console.log(err);
    // res.status(500).json(err);
    return err
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
    let date = new Date()
    date.setHours(6)
    date = date
      .toLocaleDateString()
      // .slice(0, 10)
      // .replace(/-/g, "");
    // console.log(date);
    let update = await User.updateOne(
      { _id: req.userData.userId, "weights.date": date },
      { $set:  { "weights.$.weight": weight} }
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
      .limit(5)
      .exec();
    weights = {...weights}
    weights = weights['0'].weights
    console.log(weights[8].date > weights[1].date);
    let newWeights = weights.map(weight => {return {...weight}['_doc']})
    newWeights = newWeights.sort((a,b) => {(a.date > b.date) ? 1 : (b.date > a.date) ? -1 : 0})
    // console.log(newWeights);
    res.status(200).json(newWeights);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};


exports.logout = (req, res) => {
  res.clearCookie("jwt")
  res.redirect('/')
}