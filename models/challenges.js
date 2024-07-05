const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        // required:[true,'userid is required']
    },
    challengeType:{
        type:String,
        default:null
    },
    challengeName:{
        type:String,
        default:null
    },
    image:{
        type:String,
        default:null
    },
    description:{
        type:String,
        default:null
    }
},{timestamps:true})

const challenge = mongoose.model("challenge",challengeSchema)
module.exports = challenge