const mongoose = require("mongoose");

const  workOutCategorySchema = new mongoose.Schema({
    name:{
        type:String,
        default:null
    }
},{timestamps:true})

const workOutCategory = mongoose.model('workOutPlanCategory',workOutCategorySchema);

module.exports = {workOutCategory}