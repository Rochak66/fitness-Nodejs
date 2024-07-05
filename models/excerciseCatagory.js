const mongoose = require("mongoose");

const  excerciseCatagorySchema = new mongoose.Schema({
    name:{
        type:String,
        default:null
    },
    logo:{
        type:String,
        default:null
    }
},{timestamps:true})

const excerciseCategory = mongoose.model('excerciseType',excerciseCatagorySchema);

module.exports = {excerciseCategory}