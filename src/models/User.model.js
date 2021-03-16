const mongoose = require("mongoose");
const validator = require("validator");

const heightSchema = mongoose.Schema({
  date: {
    type: String,
    default: () => {
      return new Date().toISOString().slice(0, 10).replace(/-/g, "");
    },
  },
  height: {
    type: Number,
    required: true,
  },
});

const weightSchema = mongoose.Schema({
  date: {
    type: String,
    default: () => {
      return new Date().toISOString().slice(0, 10).replace(/-/g, "");
    },
  },
  weight: {
    type: Number,
    required: true,
  },
});

const foodDataSchema = mongoose.Schema({
  date: {
    type: String,
    default: Date.now,
  },
  foodConsumed: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  about: {
    type: String,
  },
  targetWeight: {
    type: Number,
  },
  heights: {
    type: [heightSchema],
  },
  weights: {
    type: [weightSchema],
  },
  profilePic: {
    type: String,
  },
  foodData: {
    type: [foodDataSchema],
  },
  connections: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  posts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    ref: "Post",
  },
});

module.exports = mongoose.model("User", userSchema);
