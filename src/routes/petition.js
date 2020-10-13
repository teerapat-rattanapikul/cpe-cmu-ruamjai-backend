const router = require("express").Router();
const controllers = require("../controllers");

router.get("/", controllers.petitionController.getAllPetitionsVoting);
router.get("/:id", controllers.petitionController.findPetitionById);
router.get("/recent", controllers.petitionController.getRecentPetitions);
router.post("/filter", controllers.petitionController.filterPetitions);
router.get("/trending", controllers.petitionController.getTrendingPetitions);
router.post("/search", controllers.petitionController.getSearch);
module.exports = router;
