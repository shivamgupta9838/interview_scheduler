const ApiError = require("../../shared/errors/apiError");
const logger = require("../logger");
const jobService= require("../services/job.service");

async function createNewJob(req,res){

    const data= {
        ...req.body,createdBy:req.user.id
    };
    const job= await jobService.createjob(data);

    res.status(201).json({
        status: "Success",
        data: job
    });
}

async function updateJob(req,res){
    delete req.body.createdBy;

    const job= await jobService.updatejob(req.params.id,req.body);

    if(!job)
        throw new ApiError(404, "Job Not found!");

    res.status(201).json({
        status: "Success",
        data:job
    });
}

async function getAll(req,res){
    const jobs= await jobService.getAll();
    return res.send(jobs);
}

async function deletejob(req,res){
    const job = await jobService.deletejob(req.params.id);

    if(!job)
        throw new ApiError(404,"Job not Found");

    res.status(204).end();
}

module.exports= {createNewJob,updateJob,getAll, deletejob};