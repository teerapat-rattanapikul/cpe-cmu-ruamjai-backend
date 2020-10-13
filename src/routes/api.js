const router = require("express").Router();
const petitionRouter = require("./petition");
const userRouter = require("./user");
const petitonStatus = require("../database/model/petitionStatus");
const { types } = require("../database/model/petitionTypes");
const { sendSuccessResponse } = require("../helpers/apiResponse");
router.use("/petitions", petitionRouter);
router.use("/user", userRouter);
router.get("/petitionStatus", (req, res) => {
  sendSuccessResponse(res, petitonStatus);
});
router.get("/petitionTypes", (req, res) => {
  sendSuccessResponse(res, types);
});
router.get("/", (req, res, next) => res.send("api running.."));

module.exports = router;
