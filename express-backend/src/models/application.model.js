const mongoose = require("mongoose");
const logger= require("../logger");

const applicationSchema= new mongoose.Schema({
    candidate:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
        required:true
    },
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required:true
    },
    source: {
        type: String,
        enum: ["LinkedIn","Referral","Other"],
        default: "Other"
    },
    stage: {
        type:String,
        enum: ["Applied","Accepted","Interview","Offer","Hired","Rejected"],
        default:"Applied"
    },
    appliedAt: {
        type:Date,
        default:Date.now
    },
    remarks:String
},
{
    timestamps:true
}
);

applicationSchema.index(
    {
        candidate:1,
        job:1
    },{
        unique:true
    }
);

module.exports= mongoose.model("Application",applicationSchema);