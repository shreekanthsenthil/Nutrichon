const mongoose = require("mongoose");

const mealSchema = mongoose.Schema({
  food: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  calorie: {
    type: Number,
    required: true,
  },
});

const foodConsumedSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  date: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  breakfast: {
    type: [mealSchema],
  },
  lunch: {
    type: [mealSchema],
  },
  dinner: {
    type: [mealSchema],
  },
  snack: {
    type: [mealSchema],
  },
});

module.exports = mongoose.model("FoodConsumed", foodConsumedSchema);
