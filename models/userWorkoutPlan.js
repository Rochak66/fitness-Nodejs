const mongoose = require('mongoose');

const userWorkoutPlanSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:[true,'userid is required']
    },
    workoutPlanId:{
        type:mongoose.Schema.ObjectId,
        ref:"workoutPlan",
        reuired:[true,'workoutplanid is required']
    },
    startDate:{
        type:Date,
        default:null
    },
    startTime:{
        type:Date,
        default:null
    },
    completionTime:{
        type:Date,
        default:null
    },
    selectDay:{
        type:Array,
        default:[]
    },
    weeklyWeight:{
        type:Number,
        default:null
    },
    status:{
        type:String,
        enum:['completed','not completed'],
        default:null
    }
})

const userWorkoutPlan = mongoose.model('userWorkoutPlan',userWorkoutPlanSchema);

module.exports = userWorkoutPlan