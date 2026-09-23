const express= require("express");
const router= express.Router();
const interviewcontroller= require("../controllers/interview.controller");
const { authenticate, candidateAuthenticate, authorized } = require("../middlewares/auth.middleware");

router.use(authenticate);
// router.get("/approve/:id",)
router.get("/getall",interviewcontroller.getallinterview);
router.get("/:id",interviewcontroller.getInterview);
router.post("/create",interviewcontroller.createinterview);
router.post("/update/:id",interviewcontroller.updateinterview);
router.delete("/delete/:id", authorized("Interview.delete"),interviewcontroller.deleteinterview);

module.exports= router;