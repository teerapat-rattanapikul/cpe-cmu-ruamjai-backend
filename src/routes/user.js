const router = require("express").Router();
const controllers = require("../controllers");
const verify = require("../middlewares/verifyJWT");

router.post("/login", controllers.userController.login);
router.post("/approved", verify(), controllers.userController.approveForvote);
router.post("/finalApprove", verify(), controllers.userController.finalApprove);
router.get("/my", verify(), controllers.userController.getMyProfile);
router.post("/reject", verify(), controllers.userController.rejectPetition);
router.post("/vote", verify(), controllers.userController.votePetition);
router.post("/add", verify(), controllers.userController.addPetition);
router.get("/myPetitions", verify(), controllers.userController.getMyPetitions);

module.exports = router;
