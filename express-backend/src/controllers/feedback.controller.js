const ApiError = require("../../shared/errors/apiError");
const feedbackService= require("../services/feedback.service");

async function getallfeedback(req,res){
    const feedbacks= await feedbackService.getallfeedback();

    return res.json(feedbacks);
}

async function createfeedback(req,res){
    const userID= req.user.id;
    req.body.interviewer= userID;
    const feedback=await feedbackService.createfeedback(req.body);
    
    res.json({
        status:"success",
        data:feedback
    });
}

async function updatefeedback(req,res){
    const feedback= await feedbackService.updatefeedback(req.params.id,req.body);

    if(!feedback)
        throw new ApiError(404,"Feedback not found");

    res.json({
        status:"success",
        data:feedback
    });
}

async function deletefeedback(req,res){
    const feedback=await feedbackService.deletefeedback(req.params.id);

    if(!feedback)
        throw new ApiError(404,"Feedback not found");

    res.status(204).end();
}

module.exports= {getallfeedback,createfeedback,deletefeedback,updatefeedback}