const applicationController = require("../controllers/application.controller");
const express = require("express");

const router = express.Router();
const candidateRouter = express.Router();

const { authenticate, candidateAuthenticate, authorized } = require("../middlewares/auth.middleware");

// Staff routes
router.use(authenticate);
router.get("/", authorized("Application.read"), applicationController.getAllApplication);
router.post("/update/:id", authorized("Application.update"), applicationController.updateApplication);
router.delete("/delete/:id", authorized("Application.delete"), applicationController.deleteApplication);
router.patch("/action/:id", authorized("Application.changeStage"), applicationController.stageApplication);
router.patch("/decision", authorized("Application.makeDecision"), applicationController.makeDecision);

// Candidate routes
candidateRouter.use(candidateAuthenticate);
candidateRouter.get("/:id", applicationController.getApplication);
candidateRouter.post("/create", applicationController.createApplication);
candidateRouter.post("/update/:id", applicationController.updateApplication);

router.use("/candidate", candidateRouter);

module.exports = router;