const permissions = {
    admin: [
        // Users
        "User.read",
        "User.create",
        "User.update",
        "User.delete",

        // Candidates
        "Candidate.read",
        "Candidate.create",
        "Candidate.update",
        "Candidate.delete",

        // Jobs
        "Job.read",
        "Job.create",
        "Job.update",
        "Job.delete",

        // Applications
        "Application.read",
        "Application.create",
        "Application.update",
        "Application.delete",

        // Interviews
        "Interview.read",
        "Interview.create",
        "Interview.update",
        "Interview.delete",

        // Feedback
        "Feedback.read",
        "Feedback.create",
        "Feedback.update",
        "Feedback.delete",

        // Offers
        "Offer.read",
        "Offer.create",
        "Offer.update",
        "Offer.delete"
    ],

    recruiter: [
        "User.read",

        "Candidate.read",
        "Candidate.create",
        "Candidate.update",
        "Candidate.delete",

        "Job.read",
        "Job.create",
        "Job.update",
        "Job.delete",

        "Application.read",
        "Application.update",

        "Interview.read",
        "Interview.create",
        "Interview.update",

        "Feedback.read",

        "Offer.read",
        "Offer.create",
        "Offer.update"
    ],

    interviewer: [
        "Candidate.read",

        "Job.read",

        "Application.read",

        "Interview.read",
        "Interview.update",

        "Feedback.read",
        "Feedback.create",
        "Feedback.update",

        "Offer.read"
    ]
};

module.exports = permissions;