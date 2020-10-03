const router = require("express").Router();
const controllers = require("../controllers");

router.post("/aproveVote", controllers.userController.approveVote);

module.exports = router;
