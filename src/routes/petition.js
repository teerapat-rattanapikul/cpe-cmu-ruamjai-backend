const router = require("express").Router();
const controllers = require("../controllers");

router.get("/", controllers.petitionController.getAllPetitions);
router.get("/status", controllers.petitionController.getAllStatus);
router.post("/myPetitions", controllers.petitionController.getMyPetitions);
router.post("/add", controllers.petitionController.addPetition);
router.post("/vote", controllers.petitionController.votePetition);

module.exports = router;
