const router = require("express").Router();
const controllers = require("../controllers");
const verify = require("../middlewares/verifyJWT");

router.post("/login", controllers.userController.login);
router.post("/approved", controllers.userController.approveForvote);
router.post("/finalApprove", controllers.userController.finalApprove);
router.post("/reject", controllers.userController.rejectPetition);
router.post("/do", verify(), controllers.userController.doSomething);

module.exports = router;
