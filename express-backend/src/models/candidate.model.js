const mongoose = require("mongoose");
const logger = require("../logger");
const { lowercase } = require("zod");
const bcrypt= require("bcrypt");

const candidateSchema= new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password: {
        type: String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    currentCompany:{
        type:String,
    },
    currentDesination:{
        type:String,
    },
    experience:{
        type:Number,
        default:0
    },
    expectedCTC:Number,
    currentCTC:Number,
    noticePeriod:Number,
    skills:[{
        type:String,
    }],
    resume:String,
    status:{
        type:String,
        enum:["active","inactive","blacklisted"],
        default:"active"
    }
},{
    timestamps:true
}
);

candidateSchema.pre("save", async function (next){
    this.password= await bcrypt.hash(this.password, 5);
});

module.exports= mongoose.model(
    "Candidate",
    candidateSchema
);