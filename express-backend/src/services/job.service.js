const jobModel= require("../models/job.model");

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

async function getAll(req,res){
    return jobModel.find();
}

async function deletejob(id){
    return jobModel.findByIdAndDelete(id);
}

module.exports={createjob,updatejob,getAll,deletejob};