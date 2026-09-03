const express = require("express");
const logger = require("../logger");

const router = express.Router();

const { getAllUser, createuser, updateuser, deleteuser, loginUser, getuser } = require("../controllers/user.controller");

const createUserSchema = require("../validators/user.validator");
const updateUserSchema = createUserSchema.partial();

const validate = require("../middlewares/validate.middleware");
const { authenticate, authorized } = require("../middlewares/auth.middleware");

router.use((req, res, next) => {
    logger.info("user hit!");
    next();
});

router.post("/register", validate(createUserSchema), createuser);
router.post("/login", loginUser);

router.use(authenticate);

router.get("", getuser);
router.put("/update", validate(updateUserSchema), updateuser);

router.get("/all", authorized("User.read"), getAllUser);
router.delete("/:id", authorized("User.delete"), deleteuser);

module.exports = router;