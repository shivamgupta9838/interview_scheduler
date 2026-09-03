const express = require("express");

const router = express.Router();

const feedbackController = require("../controllers/feedback.controller");

const { authenticate, authorized } = require("../middlewares/auth.middleware");

router.use(authenticate);
router.get("/getall", authorized("Feedback.read"), feedbackController.getallfeedback);
router.post("/create", authorized("Feedback.create"), feedbackController.createfeedback);
router.post("/update/:id", authorized("Feedback.update"), feedbackController.updatefeedback);
router.delete("/delete/:id", authorized("Feedback.delete"), feedbackController.deletefeedback);

module.exports = router;