require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const connectDB= require("../configs/db");

const Candidate = require("../models/candidate.model");
const logger = require("../logger");

const createCandidate = async () => {
    const candidate = new Candidate({
        name: faker.person.fullName(),

        email: faker.internet.email().toLowerCase(),

        password: "123456",

        phone: faker.string.numeric(10),

        currentCompany: faker.company.name(),

        currentDesination: faker.person.jobTitle(),

        experience: faker.number.int({
            min: 0,
            max: 15,
        }),

        expectedCTC: faker.number.int({
            min: 300000,
            max: 3000000,
        }),

        currentCTC: faker.number.int({
            min: 200000,
            max: 2500000,
        }),

        noticePeriod: faker.helpers.arrayElement([
            0,
            15,
            30,
            60,
            90,
        ]),

        skills: faker.helpers.arrayElements(
            [
                "JavaScript",
                "React",
                "Node.js",
                "MongoDB",
                "Express.js",
                "Python",
                "Java",
                "SQL",
                "AWS",
                "Docker",
            ],
            {
                min: 2,
                max: 5,
            }
        ),

        resume: null,

        status: faker.helpers.arrayElement([
            "active",
            "inactive",
            "blacklisted",
        ]),
    });

    await candidate.save();
};

const seedCandidates = async (count = 100) => {
    try {
        await connectDB();

        for (let i = 0; i < count; i++) {
            await createCandidate();
        }

        logger.info(`${count} candidates created`);
    } catch (error) {
        logger.error({ err: error }, "Seeder failed");
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        logger.info("MongoDB disconnected");
    }
};

seedCandidates(1000);