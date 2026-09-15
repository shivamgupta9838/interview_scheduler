const User = require("../models/user.model");
const Cand_idate = require("../models/candidate.model");
const Job = require("../models/job.model");
const Application = require("../models/application.model");
const Interview = require("../models/interview.model");
const Feedback = require("../models/feedback.model");
const Offer = require("../models/offer.model");
const logger = require("../logger");
const jobModel = require("../models/job.model");
const applicationModel = require("../models/application.model");
const interviewModel = require("../models/interview.model");


function getUserReadScope(user) {
    switch (user.role) {
        case "admin":
            return {};

        case "recruiter":
            return { role: "interviewer" };

        case "interviewer":
            return { _id: null };

        default:
            return { _id: null };
    }
}


function getJobReadScope(user) {
    logger.info(user.id);
    switch (user.role) {
        case "admin":
            return {};

        case "recruiter":
            return { createdBy : user.id };

        case "interviewer":
            return {};

        default:
            return { _id: null };
    }
}


function getCandidateReadScope(user) {
    switch (user.role) {
        case "admin":
            return {};

        case "recruiter":
            return { recruiter_id: user._id };

        case "interviewer":
            return {};

        default:
            return { _id: null };
    }
}


async function getApplicationReadScope(user) {
    switch (user.role) {
        case "admin":
            return {};

        case "recruiter": {
            const jobs = await jobModel.find({
                createdBy: user.id
            }).select("_id").lean();

            const jobIds = jobs.map(job => job._id);

            return {
                job: { $in: jobIds }
            };
        }

        case "interviewer":
            return {};

        default:
            return { _id: null };
    }
}


async function getInterviewReadScope(user) {
    switch (user.role) {
        case "admin":
            return {};

        case "recruiter":{
            const jobs = await jobModel.find({
                createdBy: user.id
            }).select("_id").lean();

            const jobIds = jobs.map(job => job._id);

            const applications = await applicationModel.find({
                job: { $in: jobIds}
            }).select("_id").lean();

            const applicationIds = applications.map(application => application._id);

            const interviews = await interviewModel.find({
                application: { $in: applicationIds}
            }).select("_id").lean();

            const interviewIds = interviews.map(interview => interview._id);

            return {
                _id: { $in: interviewIds }
            };
        }

        case "interviewer":
            return { interviewer_id: user._id };

        default:
            return { _id: null };
    }
}


function getFeedbackReadScope(user) {
    switch (user.role) {
        case "admin":
            return {};

        case "recruiter":
            return {};

        case "interviewer":
            return { interviewer_id: user._id };

        default:
            return { _id: null };
    }
}


function getOfferReadScope(user) {
    switch (user.role) {
        case "admin":
            return {};

        case "recruiter":
            return { recruiter_id: user._id };

        case "interviewer":
            return {};

        default:
            return { _id: null };
    }
}


module.exports = {
    getUserReadScope,
    getJobReadScope,
    getCandidateReadScope,
    getApplicationReadScope,
    getInterviewReadScope,
    getFeedbackReadScope,
    getOfferReadScope
};