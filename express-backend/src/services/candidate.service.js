const jwt = require("jsonwebtoken");
const ApiError = require("../../shared/errors/apiError");
const logger = require("../logger");
const candidateModel= require("../models/candidate.model");
const bcrypt= require("bcrypt");

const {
    getPagination,
} = require("../shared/utils/pagination");

const {
    buildSort,
    buildSearchFilter,
} = require("../shared/utils/dataTable");

async function createCandidate(body){
    return candidateModel.create(body);
}

async function updateCandidate(id,body){
    return candidateModel.findByIdAndUpdate(id,body,{returnDocument: "after"});
}

async function getallcandidates(query){
    const {
        page,
        pageSize,
        skip,
    } = getPagination(query);

    const {
        search = "",
        sortBy,
        sortOrder,
    } = query;

    const filter = buildSearchFilter(search, [
        "name",
        "email",
        'phone'
    ]);

    const sort = buildSort(sortBy, sortOrder);

    const [data, total] = await Promise.all([
        candidateModel
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .lean(),

        candidateModel.countDocuments(filter),
    ]);

    return {
        data,
        pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        },
    };
}

async function getcandidate(id){
    return candidateModel.findById(id);
}

async function deleteCandidate(id){
    return candidateModel.findByIdAndDelete(id);
}

async function loginCandidate(data){
    const candidate= await candidateModel.findOne({email:data.email});

    if(!candidate)
        throw new ApiError(401,"Invalid email or password");

    const isMatch= await bcrypt.compare(data.password, candidate.password);

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