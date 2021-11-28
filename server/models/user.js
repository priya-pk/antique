const mongoose = require('mongoose');

const Schema = mongoose.Schema
const userSchema = new Schema({
    email:String,
    password: String,
    userId:String,
    userName:String,
    userAddress1: String,
    userAddress2: String,
    userDistrict: String,
    userState: String,
    userPIN: Number,
    userNumber:Number
})

module.exports = mongoose.model('user',userSchema,'users');