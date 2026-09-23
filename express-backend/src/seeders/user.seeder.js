require("dotenv").config({ quiet: true });

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

const connectDB = require("../configs/db");
const logger = require("../logger");
const User = require("../models/user.model");

const createUser = async (hashedPassword) => {

    const user = new User({
        name: faker.person.fullName(),

        email: faker.internet.email().toLowerCase(),

        password: hashedPassword,

        age: faker.number.int({
            min: 21,
            max: 60,
        }),

        active: faker.datatype.boolean(),

        role: faker.helpers.arrayElement([
            "admin",
            "recruiter",
            "interviewer",
        ]),
    });

    await user.save();
};

const seedUsers = async (count = 100) => {
    try {
        await connectDB();

        // const hashedPassword = await bcrypt.hash("123456", 5);
        const hashedPassword = "123456";

        for (let i = 0; i < count; i++) {
            await createUser(hashedPassword);
        }

        logger.info(`${count} users created`);
    } catch (error) {
        logger.error({ err: error }, "Seeder failed");
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        logger.info("MongoDB disconnected");
    }
};

seedUsers(1000);