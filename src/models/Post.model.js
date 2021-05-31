const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userName: {
    type: String
  }
});

module.exports = mongoose.model("Post", postSchema);
