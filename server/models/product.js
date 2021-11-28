const mongoose =require('mongoose');

const Schema = mongoose.Schema
const productSchema = new Schema({
    productId : Number,
    productName : String,
    productCode : String,
    category : String,
    description : String,
    price : Number,
    quantity : String,
    starRating : Number,
    imageUrl : String
})

module.exports= mongoose.model('product',productSchema,'products');