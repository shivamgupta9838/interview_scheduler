const jwt= require("jsonwebtoken");
const ApiError = require("../../shared/errors/apiError");
const logger = require("../logger");
const defineAbilityFor = require("../auth/ability");

function verifyToken(req) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new ApiError(401, "No token provided!");
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        throw new ApiError(401, "Invalid authorization header!");
    }

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new ApiError(401, "Invalid or Expired token!");
    }
}

function authenticate(req, res, next) {
    req.user = verifyToken(req);
    next();
}

function candidateAuthenticate(req, res, next) {
    req.candidate = verifyToken(req);
    next();
}

function authorized(action, resource) {
    return (req, res, next) => {
        if (!req.user) {
            return next(
                new ApiError(401, "User not authenticated!")
            );
        }

        const ability = defineAbilityFor(req.user);

        const subject = resourceMap[resource];

        if (!subject) {
            return next(
                new ApiError(500, `Unknown resource: ${resource}`)
            );
        }

        if (ability.can(action, subject)) {
            return next();
        }

        return next(
            new ApiError(
                403,
                "You do not have permission to perform this action!"
            )
        );
    };
}

module.exports= {authenticate, candidateAuthenticate, authorized};