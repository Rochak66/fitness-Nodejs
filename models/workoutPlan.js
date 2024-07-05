const mongoose = require("mongoose");

const workoutPlanSchema = new mongoose.Schema({
    name:{
        type:String,
        default:null
    },
    imageUrl:{
        type:String,
        default:null
    },
    description:{
        type:String,
        default:null
    },
    totalweeks:{
        type:Number,
        default:null
    },
    minDays:{
        type:Number,
        default:null
    },
    documents:{
        type:String,
        default:null
    },
    status:{
        type:String,
        enum:['completed','ongoing','not started'],
        default:null
    }
},{timeStamps:true})

const workOutPlanModel = mongoose.model("workoutPlan",workoutPlanSchema)

module.exports = workOutPlanModel