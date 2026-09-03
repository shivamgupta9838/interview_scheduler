const express = require("express");

const router = express.Router();

const { authenticate, candidateAuthenticate, authorized } = require("../middlewares/auth.middleware");
const candidateController = require("../controllers/candidate.controller");

// Public candidate routes
router.post("/create", candidateController.createCandidate);
router.post("/login", candidateController.loginCandidate);

// Candidate routes
router.post("/update", candidateAuthenticate, candidateController.updateCandidate);
router.get("", candidateAuthenticate, candidateController.getcandidate);

// Staff routes
router.get("/getall", authenticate, authorized("Candidate.read"), candidateController.getallcandidates);
router.delete("/delete/:id", authenticate, authorized("Candidate.delete"), candidateController.deleteCandidate);

module.exports = router;