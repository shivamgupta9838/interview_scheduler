const ApiError = require("../../shared/errors/apiError");
const logger = require("../logger");

function errorhandler(err,req,res,next){
    logger.error(err.message);

    if (err.code === 11000) {
        return res.status(409).json({
            status: false,
            message: `${Object.keys(err.keyPattern)[0]} already exists`
        });
    }

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            status: false,
            message: err.message
        });
    }

    res.status(500).json({
        status: false,
        message:err.message
    });
}

module.exports= errorhandler;