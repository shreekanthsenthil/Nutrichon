const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth")

const foodConsumedController = require('../controllers/foodConsumed.controller')

router.post('/addfood', auth, foodConsumedController.addFood)
router.post('/search', foodConsumedController.searchFood)
router.post('/setquantity', auth, foodConsumedController.setquantity)
router.get('/getfooddata', auth, foodConsumedController.getFoodData)

module.exports = router