const express = require("express");

const router = express.Router();

const { authenticate, candidateAuthenticate, authorized } = require("../middlewares/auth.middleware");
const candidateController = require("../controllers/candidate.controller");

// Public candidate routes
router.post("/create", candidateController.createCandidate);
router.post("/login", candidateController.loginCandidate);

// Candidate routes
router.post("/update/:id", candidateController.updateCandidateu);
router.post("/update", candidateAuthenticate, candidateController.updateCandidate);

// Staff routes
router.get("/getall", authenticate, authorized("Candidate.read"), candidateController.getallcandidates);
router.get("/:id", candidateAuthenticate, candidateController.getcandidate);
router.delete("/delete/:id", authenticate, authorized("Candidate.delete"), candidateController.deleteCandidate);

module.exports = router;