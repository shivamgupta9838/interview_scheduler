require("dotenv").config({ quiet: true });

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const connectDB = require("../configs/db");

const Job = require("../models/job.model");
const User = require("../models/user.model");
const logger = require("../logger");

const createJob = async (users) => {
    const minExperience = faker.number.int({
        min: 0,
        max: 8,
    });

    const maxExperience = faker.number.int({
        min: minExperience,
        max: 12,
    });

    const minSalary = faker.number.int({
        min: 300000,
        max: 1500000,
    });

    const maxSalary = faker.number.int({
        min: minSalary,
        max: 3000000,
    });

    const job = new Job({
        title: faker.helpers.arrayElement([
            "Software Engineer",
            "Senior Software Engineer",
            "Frontend Developer",
            "Backend Developer",
            "Full Stack Developer",
            "QA Engineer",
            "DevOps Engineer",
            "UI/UX Designer",
            "Project Manager",
            "HR Executive",
            "Data Analyst",
            "Product Manager",
        ]),

        description: faker.lorem.paragraph(),

        department: faker.helpers.arrayElement([
            "Engineering",
            "Human Resources",
            "Marketing",
            "Sales",
            "Finance",
            "Design",
            "Quality Assurance",
            "Management",
        ]),

        location: faker.helpers.arrayElement([
            "Lucknow",
            "Delhi",
            "Mumbai",
            "Bangalore",
            "Hyderabad",
            "Pune",
            "Chennai",
            "Noida",
            "Remote",
        ]),

        employeeType: faker.helpers.arrayElement([
            "Part Time",
            "Full Time",
            "Contract",
            "Internship",
        ]),

        experience: {
            min: minExperience,
            max: maxExperience,
        },

        salary: {
            min: minSalary,
            max: maxSalary,
            currency: "INR",
        },

        openings: faker.number.int({
            min: 1,
            max: 10,
        }),

        skills: faker.helpers.arrayElements(
            [
                "JavaScript",
                "React",
                "Node.js",
                "MongoDB",
                "Express.js",
                "TypeScript",
                "Python",
                "Java",
                "SQL",
                "AWS",
                "Docker",
                "Git",
                "Figma",
                "REST API",
            ],
            {
                min: 2,
                max: 6,
            }
        ),

        status: faker.helpers.arrayElement([
            "Open",
            "Closed",
            "On hold",
        ]),

        createdBy: faker.helpers.arrayElement(users)._id,
    });

    await job.save();
};

const seedJobs = async (count = 100) => {
    try {
        await connectDB();

        const users = await User.find().select("_id").lean();

        if (!users.length) {
            throw new Error(
                "No users found. Please seed users before running the job seeder."
            );
        }

        for (let i = 0; i < count; i++) {
            await createJob(users);
        }

        logger.info(`${count} jobs created`);
    } catch (error) {
        logger.error({ err: error }, "Seeder failed");
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        logger.info("MongoDB disconnected");
    }
};

seedJobs(1003);