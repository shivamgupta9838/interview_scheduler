const ApiError = require("../../shared/errors/apiError");
const logger = require("../logger");
const applicationModel = require("../models/application.model");
const interviewModel= require("../models/interview.model");

async function getallinterview(){
    return interviewModel.find();
}

async function createinterview(body){

    const application= await applicationModel.findById(body.application);

    if(!application)
        throw new ApiError(404,"Invalid application ID");

    if(application.stage !== "Accepted")
        throw new ApiError(400,"Application must be accepted before scheduling an interview");

    const interview = await interviewModel.create(body);

    application.stage= "Interview";
    await application.save();

    return interview;
}

async function updateinterview(id,body){
    return interviewModel.findByIdAndUpdate(id,body,{returnDocument: "after"});
}

async function deleteinterview(id){
    return interviewModel.findByIdAndDelete(id);
}

module.exports= {getallinterview,createinterview,updateinterview,deleteinterview}