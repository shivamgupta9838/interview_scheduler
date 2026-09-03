const logger = require("../logger");

function requestLogger(req, res, next) {

    const start = process.hrtime.bigint();

    res.on("finish", () => {
        const duration = Number(process.hrtime.bigint() - start) / 1_000_000;

        logger.info(
            `${req.method.padEnd(6)} ${req.originalUrl.padEnd(80)} ${String(res.statusCode).padEnd(3)} ${duration.toFixed(2)}ms`
        );
    });

    next();
}

module.exports = requestLogger;