require("dotenv").config({ quiet: true });

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const connectDB = require("../configs/db");

const Application = require("../models/application.model");
const Candidate = require("../models/candidate.model");
const Job = require("../models/job.model");
const logger = require("../logger");

const createApplication = async (candidate, job) => {
    const application = new Application({
        candidate: candidate._id,

        job: job._id,

        source: faker.helpers.arrayElement([
            "LinkedIn",
            "Referral",
            "Other",
        ]),

        stage: faker.helpers.arrayElement([
            "Applied",
            "Accepted",
            "Interview",
            "Offer",
            "Hired",
            "Rejected",
        ]),

        appliedAt: faker.date.between({
            from: new Date("2026-01-01"),
            to: new Date(),
        }),

        remarks: faker.helpers.maybe(
            () => faker.lorem.sentence(),
            { probability: 0.6 }
        ),
    });

    await application.save();
};

const seedApplications = async (count = 100) => {
    try {
        await connectDB();

        const candidates = await Candidate
            .find()
            .select("_id")
            .lean();

        const jobs = await Job
            .find()
            .select("_id")
            .lean();

        if (!candidates.length) {
            throw new Error(
                "No candidates found. Please seed candidates first."
            );
        }

        if (!jobs.length) {
            throw new Error(
                "No jobs found. Please seed jobs first."
            );
        }

        /*
         * Because candidate + job has a unique index,
         * don't create the same combination twice.
         */
        const combinations = [];

        for (const candidate of candidates) {
            for (const job of jobs) {
                combinations.push({
                    candidate: candidate._id,
                    job: job._id,
                });
            }
        }

        if (count > combinations.length) {
            count = combinations.length;

            logger.warn(
                `Only ${count} unique candidate/job combinations available`
            );
        }

        // Shuffle combinations
        faker.helpers.shuffle(combinations);

        for (let i = 0; i < count; i++) {
            await createApplication(
                combinations[i].candidate,
                combinations[i].job
            );
        }

        logger.info(`${count} applications created`);
    } catch (error) {
        logger.error(
            { err: error },
            "Application seeder failed"
        );

        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();

        logger.info("MongoDB disconnected");
    }
};

seedApplications(1000);