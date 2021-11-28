const express= require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Product = require('../models/product');
const mongoose = require('mongoose');
const db = "mongodb://localhost:27017/antique";

mongoose.connect(db,err=>{
    if (err) {
        console.error('Error!'+err)
    }
    else{
        console.log('Connected to mongodb')
    }
})

router.get('/',(req,res)=>{
    res.send('From API routes');
})

router.post('/register',(req,res)=>{
    let userData = req.body;
    User.findOne({email: userData.email},(err,user)=>{
        if(err){
            console.log(err)
        }else{
            if(!user){
                let user = new User(userData);
                user.save((err,registeredUser)=>{
                    if(err){
                        console.log(err)
                        res.status(500).send("Error Found");
                    }
                    else{
                        let payload = { 
                            userId: registeredUser._id,
                            email: registeredUser.email,
                        } 
                        let  token = jwt.sign(payload,'secretKey')
                        res.status(200).send({token})
                    }
                })
            }
        }
    })
})

router.post('/login',(req,res)=>{
    let userData = req.body
    User.findOne({email: userData.email},(err,user)=>{
        if(err){
            console.log(err)
        }else{
            if(!user){
                res.status(401).send('Invalid Email');
            }
            else if(user.password !== userData.password){
                res.status(401).send('Invalid password');
            }else{
                let payload = { 
                    userId:user._id ,
                    email: user.email,
                }
                let token = jwt.sign(payload,'secretKey')
                res.status(200).send({token});
            }
        }
    })
})

//admin
router.post('/admin',(req,res)=>{
    console.log('entered')
    let adminData= req.body
    if(req.body.username=="admin" && req.body.password=="12345"){
        // console.log("admin")
        let payload = { subject: adminData }
        let token = jwt.sign(payload,'secretKey')
        return res.status(200).send({token,userType:'admin'})
    }
    else{
        return res.status(401).send('Unauthorized Request')
    }
})
   



router.get('/products',(req,res)=>{
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Methods :GET,POST,PATCH,PUT,DELETE,OPTIONS')
    Product.find()
    .then((products)=>{
        res.send(products)
    })
})

router.post('/insert',(req,res)=>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods :GET,POST,PATCH,PUT,DELETE,OPTIONS')
    console.log(req.body);
    var product={
        productId: req.body.product.productId,  //item is named as product is send from the front end so named as product.product.productId and assining to product object
        productName: req.body.product.productName,  
        productCode: req.body.product.productCode,
        category:req.body.product.category,
        // releaseDate: req.body.product.releaseDate,
        description: req.body.product.description,
        price: req.body.product.price,
        quantity:req.body.product.quantity,
        // starRating: req.body.product.starRating,
        imageUrl: req.body.product.imageUrl
    }
    var product = new Product(product); //creating object of model and saving to var product
    product.save((err,pData)=>{
        if(err){
            console.log(err)
        }
        else{
            res.status(200).send(pData)
        }
    })
})
//edit
router.get('/read/:id',(req,res)=>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods :GET,POST,PATCH,PUT,DELETE,OPTIONS')
    const id = req.params.id;
    Product.findOne({_id:id})
    .then((product)=>{
        console.log(product);
        res.send(product);
    })
 })

router.put('/update/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods :GET,POST,PATCH,PUT,DELETE,OPTIONS')
    const id = req.params.id;
    console.log(req.body);
        var product = {
            productId: req.body.productId,
            productName: req.body.productName,
            productCode: req.body.productCode,
            category:req.body.category,
            releaseDate: req.body.releaseDate,
            description: req.body.description,
            price: req.body.price,
            quantity:req.body.quantity,
            starRating: req.body.starRating,
            imageUrl: req.body.imageUrl
        }
        Product.findByIdAndUpdate(id,product)
        .then((product)=>{
            product.save();
            console.log('Updated');
        })
        .catch((err)=>{
            console.log(err);
        })
})

router.delete('/delete/:id',(req,res)=>{
    const id = req.params.id;
    Product.findOneAndRemove({_id:id},(err,product)=>{
        if(err)
            console.log(err)
        else{
            console.log('deleted',product)
        }
    })
})

module.exports = router;