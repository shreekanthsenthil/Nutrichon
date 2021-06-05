const mongoose = require("mongoose");
const FoodConsumed = require('../models/foodConsumed.model')
const FoodInfo = require('../models/foodInfo.model')

const addFood = async (req, res) => {
    try{
        let date = new Date()
        date.setHours(6)
        date = date
        .toLocaleDateString()
        let meal = {
            food: req.body.food,
            calorie: req.body.calorie,
            quantity: 1
        }
        let type = req.body.type
        let alreadyPresent = await FoodConsumed.findOne({date: date, userId: req.userData.userId})
        if(alreadyPresent){
            let tobePushed = {}
            tobePushed[type] = meal
            console.log(tobePushed);
            await FoodConsumed.updateOne({date: date, userId: req.userData.userId}, {$push: tobePushed})
        } else {
            let food = new FoodConsumed({
                _id: mongoose.Types.ObjectId(),
                date: date,
                userId: req.userData.userId
            })
            food[type] = [meal]
            console.log(food);
            await food.save()
        }
        
        res.send("Success")
    }
    catch(e){
        console.log(e);
        res.send(e)
    }
}

const searchFood = async (req, res) => {
    try{
        let searchTerm = req.body.searchTerm
        if(typeof(searchTerm) == 'string')
        {
            // let users = await userCollection.find({ $or: [{username: { $regex: '.*' + searchTerm + '.*'}}, {email: { $regex: '.*' + searchTerm + '.*'}}]}).toArray()
            let food = await FoodInfo.find({fooditem: { $regex: '.*' + searchTerm + '.*'}})
            // let food = await FoodInfo.find({fooditem: searchTerm})
            res.json(food)
        }
        else {
            res.json([])
        }
    }catch(e){
        console.log(e);
        res.send(e)
    }
}

const setquantity = async (req, res) => {
    try {
        let date = new Date()
        date.setHours(6)
        date = date
        .toLocaleDateString()
        // let update = await User.updateOne(
        //     { _id: req.userData.userId, "weights.date": date },
        //     { $set:  { "weights.$.weight": weight} }
        //   )
        let typeFood = req.body.type + '.food'
        let updateQuanField = req.body.type + '.$.quantity'
        let updateFind = {
            userId: req.userData.userId,
            date: date
        }
        updateFind[typeFood] = req.body.food
        let updateSet = {}
        updateSet[updateQuanField] = req.body.quantity
        let update = await FoodConsumed.updateOne(updateFind,{$set: updateSet})
        res.send(update)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

const getFoodData = async(req, res) => {
    try {
        let date = new Date()
        date.setHours(6)
        date = date
        .toLocaleDateString()
        let foodData = await FoodConsumed.findOne({userId: req.userData.userId, date: date})
        res.json(foodData)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}

module.exports = {
    addFood,
    searchFood,
    setquantity,
    getFoodData
}