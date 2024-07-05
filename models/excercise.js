const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    exerciseCatagoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"excerciseType",
        required:true
    },
    name:{
        type:String,
        default:null
    },
    image:{
        type:String,
        default:null
    },
    video_url:{
        type:String,
        default:null
    },
    description:{
        type:String,
        default:null
    },
    tips:{
        type:String,
        default:null
    }
},{timestamps:true})

const excercise = mongoose.model("excercise",exerciseSchema);
module.exports = {excercise};