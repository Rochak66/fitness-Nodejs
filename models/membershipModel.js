const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    purchaseDate:{
        type:Date,
        default:null
    },
    RenevelDate:{
        type:Date,
        default:null
    },
    paymentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"payment",
        required:true
    },
    subscriptionStatus:{
        type:String,
        enum:['active','inactive'],
        default:null
    }
},{timestamps:true})

const membership = mongoose.model("membership",membershipSchema);
module.exports = membership