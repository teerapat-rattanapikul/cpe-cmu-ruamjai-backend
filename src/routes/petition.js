const router = require("express").Router();
const controllers = require("../controllers");

router.get("/", controllers.petitionController.getAllPetitionsVoting);
router.get("/status", controllers.petitionController.getAllStatus);
router.get("/recent",controllers.petitionController.getRecentPetitions);
router.post("/myPetitions", controllers.petitionController.getMyPetitions);
router.post("/add", controllers.petitionController.addPetition);
router.post("/vote", controllers.petitionController.votePetition);

module.exports = router;
