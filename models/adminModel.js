const mongoose = require('mongoose');

require("dotenv").config();

const adminSchema = new mongoose.Schema({
    fullname:{
        type:String,
        require:[true,'name is required']
    },
    phoneno:{
        type:Number,
        default:null
    },
    email:{
        type:String,
        require:[true,'email is require']
    },
    password:{
        type:String,
        require:[true,'enter password']
    },
    otp:{
        type:String,
        // require:[true,'otp is required']
    }
},{timestamps:true});


const admin = mongoose.model("admin",adminSchema);
module.exports = admin