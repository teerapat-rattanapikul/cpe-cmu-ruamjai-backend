const router = require("express").Router();
const petitionRouter = require("./petition");
const userRouter = require("./user");

router.use("/petitions", petitionRouter);
router.use("/user", userRouter);

router.get("/", (req, res, next) => res.send("api running.."));

module.exports = router;
