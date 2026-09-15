const jobModel= require("../models/job.model");
const { getJobReadScope } = require("../auth/scope");
const { getDatatableFilters } = require("../shared/utils/dataTable");
const logger = require("../logger");

async function createjob(user){

    return jobModel.create(user);
}

async function updatejob(id,data){

    return jobModel.findByIdAndUpdate(
        id,
        data,
        {returnDocument: "after"}
    );
}

async function getAll(query,user){
    const scope = getJobReadScope(user);
    
    return getDatatableFilters({
        model: jobModel,
        query,
        searchFields: [
            "name",
            "email",
            "phone",
        ],
        filter: scope,
    });
}

async function deletejob(id){
    return jobModel.findByIdAndDelete(id);
}

module.exports={createjob,updatejob,getAll,deletejob};