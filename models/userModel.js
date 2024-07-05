const mongoose = require('mongoose');
require("dotenv").config();

const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        require:[true,'name is required'],
        default:"xyz"
    },
    gender:{
        type:String,
        default:"M"
    },
    profileImg:{
        type:String,
        require:[]
    },
    phoneno:{
        type:Number,
        default:3434345453
    },
    email:{
        type:String,
        require:[true,'email is require']
    },
    email_verified:{
        type:Boolean,
        default:false
    },
    date:{
        type:Date,
        default:"10/2/2024"
    },
    dob:{
        type:Date,
        default:"12/3/2002"
    },
    password:{
        type:String,
        require:[true,'enter password']
    },
    weight:{
        type:Number,
        default:23
    },
    weightUnit:{
        type:String,
        default:"kg"
    },
    height:{
        type:Number,
        default:3
    },
    heightUnit:{
        type:String,
        default:"ft"
    },
    otp:{
        type:String,
        require:[true,'otp is required']
    },
    goal:{
        type:String,
        default:null
    },
    status:{
        type:String,
        enum:['Active','Inactive'],
        default:null
    }
},{timestamps:true});


const user = mongoose.model("user",userSchema);
module.exports = user