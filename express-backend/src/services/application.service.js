const ApiError = require("../../shared/errors/apiError");
const logger = require("../logger");
const applicationModel= require("../models/application.model");
const jobModel = require("../models/job.model");
const offerModel = require("../models/offer.model");

async function getAllApplication(filters={}){

    return applicationModel.find(filters);
}

async function getApplication(id){
    return applicationModel.findById(id);
}

async function createApplication(data){
    const job= await jobModel.findById(data.job);

    if(!job)
        throw new ApiError(404,"Job not found");

    if(job.status !== "Open")
        throw new ApiError(400,"Job whether is closed or on hold");
    
    return applicationModel.create(data);
}

async function updateApplication(id,data){
    return applicationModel.findByIdAndUpdate(id,data,{returnDocument: "after"});
}

async function deleteApplication(id){
    return applicationModel.findByIdAndDelete(id);
}

async function stageApplication(id,action){
    const application= await applicationModel.findById(id);
    if(!application)
        throw new ApiError(404,"Application Not Found");

    // if(application.stage !== "Applied"){
    //     throw new ApiError(400,"Only applied application can be accepted");
    // }

    application.stage= action;
    return await application.save();
}

async function makeDecision(data){
    const application= await applicationModel.findById(data.application);
    if(!application)
        throw new ApiError(404,"Invalid application ID");

    if(application.stage !== "Interview")
        throw new ApiError(400,"Application is not currently in Interview stage");

    if(!["Offer","Rejected"].includes(data.decision))
        throw new ApiError(400,"Invalid application Decision");

    if(data.decision==="Rejected"){
        application.stage= data.decision;
        await application.save();
        return application;
    }

    if(data.decision==="Offer"){
        const existingOffer= await offerModel.findOne({
            application: application._id
        });
        if(existingOffer)
            throw new ApiError(400,"Offer already exist for this application");
        
        const offer = await offerModel.create(data);

        application.stage= data.decision;
        await application.save();
        return {
            application, offer
        };
    }
}

module.exports = {getAllApplication,getApplication,updateApplication,createApplication,deleteApplication, stageApplication, makeDecision}