const ApiError = require("../../shared/errors/apiError");
const logger = require("../logger");
const feedbackModel= require("../models/feedback.model");
const interviewModel= require("../models/interview.model");
const userModel= require("../models/user.model");

async function getallfeedback(){
    return feedbackModel.find();
}

async function createfeedback(body){
    const interview= await interviewModel.findById(body.interview);

    if(!interview)
        throw new ApiError(404,"Invalid Interview ID");

    if(interview.status !== "Scheduled")
        throw new ApiError(404,"Feedback cannot be submitted for this interview");

    logger.info(interview.interviewers,body.interviewer);
    const isInterviewer= interview.interviewers.some(
        id => id.toString() === body.interviewer.toString()
    );

    if(!isInterviewer)
        throw new ApiError(403,"You are not assigned for this interview");

    const feedback= await feedbackModel.create(body);

    const feedbackcount= await feedbackModel.countDocuments({
        interview: interview._id
    })

    if(feedbackcount === interview.interviewers.length) {
        interview.status = "Completed"
        await interview.save();
    }

    return feedback;
}

async function updatefeedback(id,body){
    return feedbackModel.findByIdAndUpdate(id,body,{returnDocument:"after"})
}

async function deletefeedback(id){
    return feedbackModel.findByIdAndDelete(id);
}

module.exports={
    getallfeedback,createfeedback,updatefeedback,deletefeedback
}