const mongoose = require("mongoose");

const offerSchema= new mongoose.Schema(
    {
        application:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application",
            required:true
        },
        position:{
            type:String,
            required:true,
        },
        ctc:{
            type:Number,
            required:true,
            min:0
        },
        joiningDate:{
            type:Date
        },
        status:{
            type:String,
            enum: ["Pending","Accepted","Rejected","Expired"],
            default:"Pending"
        },
        offeredAt:{
            type:Date,
            default:Date.now
        },
        remark:{
            type: String,
        }
    },{
        timestamps:true
    }
);

module.exports= mongoose.model("Offer",offerSchema);