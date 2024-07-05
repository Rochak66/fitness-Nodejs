const mongoose = require('mongoose');

const helpSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        required:[true,'userid is required']
    },
    topic:{
        type:String,
        default:null
    },
    text:{
        type:String,
        default:null
    },
    file:{
        type:String,
        default:null
    }
},{timestamps:true})

const help = mongoose.model('help',helpSchema)

module.exports = help