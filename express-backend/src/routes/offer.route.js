const offerController= require("../controllers/offer.controller");
const express= require("express");
const router= express.Router();

router.get("/getall",offerController.getall);
router.post("/create",offerController.createone);
router.get("/getone/:id",offerController.getone);
router.post("/update/:id",offerController.updateone);
router.delete("/delete/:id",offerController.deleteoffer);

module.exports= router;