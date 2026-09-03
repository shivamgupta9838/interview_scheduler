const ApiError = require("../../shared/errors/apiError");
const logger = require("../logger");
const applicationService= require("../services/application.service");

async function getAllApplication(req,res){
    const applications= await applicationService.getAllApplication(req.query);

    res.json(applications);
}

async function getApplication(req,res){
    const application = await applicationService.getApplication(req.params.id);

    if(!application)
        throw new ApiError(404,"Application not found");

    res.json(application);
}

async function createApplication(req,res){
    delete req.body.stage;

    const candidateID= req.candidate.id;
    req.body.candidate= candidateID;
    const application= await applicationService.createApplication(req.body);

    res.json(application);
}

async function updateApplication(req,res){
    delete req.body.candidate;
    delete req.body.application;
    delete req.body.job;

    const application= await applicationService.updateApplication(req.params.id, req.body);

    res.json(application);
}

async function deleteApplication(req,res){
    const application= await applicationService.deleteApplication(req.params.id);

    if(!application)
        throw new ApiError(404, "Application not found");

    res.status(204).end();
}

async function stageApplication(req, res) {
    const application = await applicationService.stageApplication(req.params.id, req.body.action);

    res.json({
        status: true,
        message: `Application ${req.body.action}`,
        data: application
    });
}

async function makeDecision(req,res){
    const data= await applicationService.makeDecision(req.body);

    res.json(data);
}

module.exports = {getAllApplication,getApplication,deleteApplication,updateApplication,createApplication, stageApplication, makeDecision}