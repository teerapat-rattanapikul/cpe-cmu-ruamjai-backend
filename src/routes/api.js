const router = require("express").Router();
const petitionRouter = require("./petition");
const userrouter = require("./user");

router.use("/petitions", petitionRouter);
router.use("/users", userrouter);

router.get("/", (req, res, next) => res.send("api running.."));

module.exports = router;
