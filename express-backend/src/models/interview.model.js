const mongoose= require("mongoose");

const interviewSchema= new mongoose.Schema(
    {
        application:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Application",
            required:true
        },
        interviewers: [{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }],
        round:{
            type:Number,
            default:1
        },
        interviewType:{
            type:String,
            enum: ["HR","Technical","Managerial","Final"],
            required:true
        },
        mode: {
            type:String,
            enum: ["Online","Offline"],
            default:"Online"
        },
        startTime: Date,
        endTime: Date,
        meetingLink:String,
        location:String,
        status:{
            type:String,
            enum: ["Scheduled","Completed", "Cancelled"],
            default:"Scheduled"
        }
    },{
        timestamps:true
    }
);

module.exports= mongoose.model("Interview",interviewSchema);