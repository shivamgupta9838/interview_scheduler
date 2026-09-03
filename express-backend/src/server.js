require("dotenv").config({ quiet: true });

const app= require("./app");
const connectDB= require("./configs/db");
const logger= require("./logger");

async function startServer() {
    try {
        await connectDB();
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }
}

startServer();

app.listen(process.env.PORT, () => {
    logger.info(`Server running on port ${process.env.PORT}`);
});