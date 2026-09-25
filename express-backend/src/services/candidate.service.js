const jwt = require("jsonwebtoken");
const ApiError = require("../../shared/errors/apiError");
const logger = require("../logger");
const candidateModel= require("../models/candidate.model");
const bcrypt= require("bcrypt");

const { getDatatableFilters } = require("../shared/utils/dataTable");
const { getCandidateReadScope } = require("../auth/scope");

async function createCandidate(body){
    return candidateModel.create(body);
}

async function updateCandidate(id,body){
    logger.info(body);
    return candidateModel.findByIdAndUpdate(id,body,{returnDocument: "after"});
}

async function getallcandidates(query, user) {
    const scope = getCandidateReadScope(user);

    return getDatatableFilters({
        model: candidateModel,
        query,
        searchFields: [
            "name",
            "email",
            "phone",
        ],
        filter: scope,
    });
}

async function getcandidate(params,user){
    // const scope = await getCandidateReadScope(user);

    return await candidateModel.findById(params.id);
}

async function deleteCandidate(id){
    return candidateModel.findByIdAndDelete(id);
}

async function loginCandidate(data){
    const candidate= await candidateModel.findOne({email:data.email});

    if(!candidate)
        throw new ApiError(401,"Invalid email or password");

    // const isMatch= await bcrypt.compare(data.password, candidate.password);
    const isMatch= data.password == candidate.password;

    if(!isMatch)
        throw new ApiError(401,"Invalid email or password");

    const accessToken= jwt.sign({
        id: candidate._id,
        email: candidate.email,
    },
        process.env.JWT_SECRET
    );

    return accessToken;
}

module.exports= {createCandidate,updateCandidate,getallcandidates,getcandidate , deleteCandidate, loginCandidate};