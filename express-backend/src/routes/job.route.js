const express = require("express");

const router = express.Router();

const { createNewJob, updateJob, getAll, deletejob } = require("../controllers/job.controller");

const { authenticate, authorized } = require("../middlewares/auth.middleware");

router.use(authenticate);

router.get("/getall", getAll);
router.post("/create", authorized("Job.create"), createNewJob);
router.post("/update/:id", authorized("Job.update"), updateJob);
router.delete("/delete/:id", authorized("Job.delete"), deletejob);

module.exports = router;