//jshint esversion:6
require('dotenv').config();

const express=require("express");
const bodyParser=require("body-parser");
// Add this for security and encryption
const encrypt=require("mongoose-encryption");
const app=express();
// Using dotenv, we can access the API_KEY from .env file
console.log(process.env.API_KEY)
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// Connecting with database
const mongoose=require("mongoose");
const url="mongodb://127.0.0.1:27017/User_DB";
mongoose.connect(url,{useNewUrlParser:true});
// chcek if we are connected
const db=mongoose.connection;
db.once('open',function(){
    console.log("Database Connected.");
});
// convert javascript object into mongoose traditional schema
const userSchema=new mongoose.Schema({
    email:String,
    password:String,
});
// for encrption
// const secret= "Thisisourlittlesecret"; //encryption key
// userSchema.plugin(encrypt,{secret: secret, encryptedFields: ['password']});
userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ['password']});


const UserDB=mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home")
});
app.get("/login",function(req,res){
    res.render("login")
});
app.get("/register",function(req,res){
    res.render("register")
});

app.post("/register",function(req,res){
    const newuser=new UserDB({
        email: req.body.username,
        password: req.body.password
    });
    newuser.save();
    res.render("secrets");
});

app.post("/login",function(req,res){
    const form_email=req.body.username;
    const form_password=req.body.password;
    UserDB.findOne({email: form_email,password: form_password},function(err,foundItem){
        if(!err){
            // if user does not exists, rediresct to signup page
            if(foundItem){
                // console.log("User does not exists");
                res.render("secrets");
            }
            
        }
    });
});



app.listen(3000,function(){
    console.log("Server is Running on 3000");
});