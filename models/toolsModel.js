const mongoose = require('mongoose');

const toolsModel = new mongoose.Schema({
    name:{
        type:String,
        default:null
    },
    logo:{
        type:String,
        default:null
    }},{timeStamps:true})
const toolModel = mongoose.model('tools',toolsModel)
module.exports = {toolModel}