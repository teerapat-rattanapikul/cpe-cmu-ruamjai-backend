const router = require("express").Router();
const controllers = require("../controllers");

router.get("/", controllers.petitionController.getAllPetitions);
router.get("/status", controllers.petitionController.getAllStatus);
<<<<<<< HEAD
router.get("/allvoting" ,controllers.petitionController.getAllPetitionsVoting);
router.get("/recent",controllers.petitionController.getRecentPetitions);
=======
router.post("/myPetitions", controllers.petitionController.getMyPetitions);
router.post("/add", controllers.petitionController.addPetition);

>>>>>>> 093307104d405fab9a7bcfce3ef2db00562f70f7
module.exports = router;
