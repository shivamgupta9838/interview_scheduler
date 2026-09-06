const User = require("../models/user.model");
const Cand_idate = require("../models/candidate.model");
const Job = require("../models/job.model");
const Application = require("../models/application.model");
const Interview = require("../models/interview.model");
const Feedback = require("../models/feedback.model");
const Offer = require("../models/offer.model");
const logger = require("../logger");


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


function getCand_idateReadScope(user) {
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


function getApplicationReadScope(user) {
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


function getInterviewReadScope(user) {
    switch (user.role) {
        case "admin":
            return {};

        case "recruiter":
            return { recruiter_id: user._id };

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
    getCand_idateReadScope,
    getApplicationReadScope,
    getInterviewReadScope,
    getFeedbackReadScope,
    getOfferReadScope
};