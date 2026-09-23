const ApiError = require("../../shared/errors/apiError");
const { getInterviewReadScope } = require("../auth/scope");
const logger = require("../logger");
const applicationModel = require("../models/application.model");
const interviewModel= require("../models/interview.model");
const { getDatatableFilters } = require("../shared/utils/dataTable");

async function getallinterview(query,user){
    const scope = await getInterviewReadScope(user);

    return getDatatableFilters({
        model: interviewModel,
        query,
        searchFields: [
            "name",
            "email",
            "phone",
        ],
        filter: scope,
        populate: [
            {
                path: "application",
                select: "candidate job source stage appliedAt",
                populate: [
                    {
                        path: "candidate",
                        select: "name email phone",
                    },
                    {
                        path: "job",
                        select: "title department location",
                    },
                ],
            },
            {
                path: "interviewers",
                select: "name email",
            },
        ],
    });
}

async function getInterview(params,user){
    const scope = await getInterviewReadScope(user);

    return await interviewModel.findById(params.id)
        .populate([
            {
                path: "application",
                select: "candidate job source stage appliedAt",
                populate: [
                    {
                        path: "candidate",
                        select: "name email phone",
                    },
                    {
                        path: "job",
                        select: "title department location",
                    },
                ],
            },
            {
                path: "interviewers",
                select: "name email",
            },
        ]);
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

module.exports= {getallinterview,createinterview,updateinterview,deleteinterview, getInterview}