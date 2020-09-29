const router = require("express").Router();
const petitionRouter = require("./petition");

router.use("/petitions", petitionRouter);

router.get("/", (req, res, next) => res.send("api running.."));

module.exports = router;
