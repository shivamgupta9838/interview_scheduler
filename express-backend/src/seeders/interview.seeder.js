require("dotenv").config({
    path: require("path").resolve(__dirname, "../../.env"),
    quiet: true,
});

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const connectDB = require("../configs/db");

const Interview = require("../models/interview.model");
const Application = require("../models/application.model");
const User = require("../models/user.model");
const logger = require("../logger");

const seedInterviews = async () => {
    try {
        await connectDB();

        const applications = await Application
            .find()
            .select("_id")
            .lean();

        const users = await User
            .find()
            .select("_id")
            .lean();

        if (!applications.length) {
            throw new Error(
                "No applications found. Please seed applications first."
            );
        }

        if (!users.length) {
            throw new Error(
                "No users found. Please seed users first."
            );
        }

        // Remove existing interviews
        await Interview.deleteMany({});

        for (const application of applications) {
            const interview = new Interview({
                application: application._id,

                interviewers: faker.helpers
                    .arrayElements(users, {
                        min: 1,
                        max: Math.min(3, users.length),
                    })
                    .map((user) => user._id),

                round: 1,

                interviewType: faker.helpers.arrayElement([
                    "HR",
                    "Technical",
                    "Managerial",
                ]),

                mode: faker.helpers.arrayElement([
                    "Online",
                    "Offline",
                ]),

                status: faker.helpers.arrayElement([
                    "Scheduled",
                    "Completed",
                    "Cancelled",
                ]),
            });

            await interview.save();
        }

        logger.info(
            `${applications.length} interviews created`
        );
    } catch (error) {
        logger.error(
            { err: error },
            "Interview seeder failed"
        );

        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();

        logger.info("MongoDB disconnected");
    }
};

seedInterviews();