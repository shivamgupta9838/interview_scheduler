const ApiError = require("../../shared/errors/apiError");
const logger = require("../logger");
const candidateService= require("../services/candidate.service");

async function createCandidate(req,res){
    const candidate= await candidateService.createCandidate(req.body);

    res.json({
        status: "success",
        data: candidate
    });
}

async function updateCandidate(req,res){
    const candidateID= req.candidate.id;
    const candidate= await candidateService.updateCandidate(candidateID,req.body);

    res.json({
        status:"success",
        data: candidate
    })
}

async function getallcandidates(req,res){
    const candidates= await candidateService.getallcandidates();

    res.json(candidates);
}

async function getcandidate(req,res){
    const candidateID= req.candidate.id;
    const candidate= await candidateService.getcandidate(candidateID);

    if(!candidate)
        throw new ApiError(404, "Candidate not found");

    res.json(candidate);
}

async function deleteCandidate(req,res){
    const candidate= await candidateService.deleteCandidate(req.params.id);

    if(!candidate)
        throw new ApiError(404,"Candidate not found");

    res.status(204).end();
}

async function loginCandidate(req,res){
    const accessToken= await candidateService.loginCandidate(req.body);

    res.status(200).json({
        status:true,
        accessToken: accessToken
    });
}

module.exports= {getallcandidates, getcandidate,deleteCandidate,updateCandidate,createCandidate, loginCandidate};