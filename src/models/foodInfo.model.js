const mongoose = require('mongoose')

const foodInfoSchema = mongoose.Schema({
    fooditem: {
        type: String,
        required: true
    },
    calories: {
        type: Number
    },
    carbs: {
        type: Number
    },
    protien: {
        type: Number
    },
    fat: {
        type: Number
    }
})

module.exports = mongoose.model('foodInfo', foodInfoSchema, 'foodInfo')