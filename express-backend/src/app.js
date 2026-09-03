const express= require("express");
const cors = require("cors");
const requestlogger= require("./middlewares/logger.middleware");
const errorHandler= require("./middlewares/error.middleware");

const userRouter= require("./routes/user.route");
const jobRouter= require("./routes/job.route");
const candidateRouter= require("./routes/candidate.route");
const interviewRouter= require("./routes/interview.route");
const feedbackRouter= require("./routes/feedback.route");
const applicationRouter= require("./routes/application.route");
const offerRouter= require("./routes/offer.route");

const app= express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.use(requestlogger);

app.use("/users",userRouter);

app.use("/jobs",jobRouter);

app.use("/candidate",candidateRouter);

app.use("/interview",interviewRouter);

app.use("/feedback",feedbackRouter);

app.use("/application",applicationRouter);

app.use("/offer", offerRouter);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.use(errorHandler);

module.exports= app;