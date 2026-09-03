const express= require("express");
const router= express.Router();
const interviewcontroller= require("../controllers/interview.controller");

// router.get("/approve/:id",)
router.get("/getall",interviewcontroller.getallinterview);
router.post("/create",interviewcontroller.createinterview);
router.post("/update/:id",interviewcontroller.updateinterview);
router.delete("/delete/:id",interviewcontroller.deleteinterview);

module.exports= router;