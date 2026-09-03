const ApiError = require("../../shared/errors/apiError");
const interviewService= require("../services/interview.service");

async function getallinterview(req,res){
    const interviews= await interviewService.getallinterview();

    return res.json(interviews);
}

async function createinterview(req,res){
    const interview= await interviewService.createinterview(req.body);

    return res.json({
        status : 'success',
        data : interview
    });
}

async function updateinterview(req,res){
    const interview= await interviewService.updateinterview(req.params.id,req.body);

    if(!interview)
        throw new ApiError(404,"Interview not found");

    return res.json({
        status:'success',
        data:interview
    });
}

async function deleteinterview(req,res){
    const interview= await interviewService.deleteinterview(req.params.id);

    if(!interview)
        throw new ApiError(404,"Interview not found");

    res.status(204).end();
}

module.exports= {getallinterview,updateinterview,createinterview,deleteinterview}