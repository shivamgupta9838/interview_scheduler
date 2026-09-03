const mongoose = require("mongoose");
const logger = require("../logger");

const jobSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    department:{
        type:String,
        required:true,
        trim:true
    },
    location:{
        type:String,
        required:true
    },
    employeeType:{
        type:String,
        enum: ["Part Time", "Full Time", "Contract", "Internship"],
        default:"Full Time"
    },
    experience:{
        min:{
            type:Number,
            default:0
        },
        max:{
            type:Number,
            default:0
        }
    },
    salary:{
        min:Number,
        max:Number,
        currency:{
            type:String,
            default:"INR"
        }
    },
    openings:{
        type:Number,
        default:1
    },
    skills:[{
        type:String,
        trim:true
    }],
    status:{
        type:String,
        enum:["Open","Closed","On hold"],
        default:"Open"
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

},
    {
        timestamps:true
    }
)

module.exports= mongoose.model("Job", jobSchema);