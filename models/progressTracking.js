const mongoose = require('mongoose');

const progressTrackingSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,'userid is required']
    },
    challengeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"challenges",
        required:[true,'challenge id is required']
    },
    Date:{
        type:Date,
        default:null
    },
    weight:{
        type:Number,
        default:00
    },
    weightUnit:{
        type:String,
        default:"kg"
    },
    height:{
        type:Number,
        default:00
    },
    heightUnit:{
        type:String,
        default:"Ft"
    },
    Day:{
        type:Number,
        default:null
    },
    Status:{
        type:Array,
        default:[]
    }
},{timestamps:true})

const progressTracking = mongoose.model("progressTracking",progressTrackingSchema)

module.exports = progressTracking