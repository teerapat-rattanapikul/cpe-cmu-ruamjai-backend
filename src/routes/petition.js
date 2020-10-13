const router = require("express").Router();
const controllers = require("../controllers");

router.get("/", controllers.petitionController.getAllPetitionsVoting);
router.get("/all", controllers.petitionController.getAllPetitions);
router.get("/:id", controllers.petitionController.findPetitionById);
router.post("/recent", controllers.petitionController.getRecentPetitions);
router.post("/filter", controllers.petitionController.filterPetitions);
router.post("/trending", controllers.petitionController.getTrendingPetitions);
router.post("/search", controllers.petitionController.getSearch);
module.exports = router;
