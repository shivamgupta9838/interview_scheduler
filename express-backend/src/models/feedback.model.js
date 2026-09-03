const mongoose= require("mongoose");

const feedbackSchema= new mongoose.Schema(
    {
        interview:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Interview",
            required:true
        },
        interviewer:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        rating:{
            type:Number,
            min:1,
            max:5,
            required:true
        },
        strengths:[{
            type:String,
            trim:true
        }],
        weaknesses:[{
            type:String,
            trim:true
        }],
        comments:{
            type:String,
            trim:true
        },
        submittedAt:{
            type:Date,
            default:Date.now
        }
    },{
        timestamps:true
    }
);

feedbackSchema.index(
    {
        interview:1,
        interviewer:1
    },
    {
        unique: true
    }
);

module.exports=mongoose.model("Feedback",feedbackSchema);