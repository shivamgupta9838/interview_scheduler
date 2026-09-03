const mongoose = require("mongoose");
const logger = require("../logger");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        logger.info("MongoDB connected!");
    }catch(err){
        logger.error(err);

        process.exit(1);
    }
}

module.exports= connectDB;