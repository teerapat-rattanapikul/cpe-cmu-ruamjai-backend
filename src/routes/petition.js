const router = require("express").Router();
const controllers = require("../controllers");

router.get("/", controllers.petitionController.getAllPetitions);
router.get("/status", controllers.petitionController.getAllStatus);
router.get("/allvoting" ,controllers.petitionController.getAllPetitionsVoting);
router.get("/recent",controllers.petitionController.getRecentPetitions);
module.exports = router;
