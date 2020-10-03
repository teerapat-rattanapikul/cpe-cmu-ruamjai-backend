const {
  sendSuccessResponse,
  sendErrorResponse,
  apiError,
} = require("../helpers/apiResponse");

const petitionStatus = require("../database/model/petitionStatus");
const petition = require("../database/model/petition");
const user = require("../database/model/user");

exports.getAllStatus = (req, res, next) => {
  sendSuccessResponse(res, { petitionStatus });
};

exports.getAllPetitions = async (req, res, next) => {
  try {
    const result = await petition.find().populate("owner");
    sendSuccessResponse(res, { result });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.addPetition = async (req, res, next) => {
  try {
    let data = req.body;
    await petition.create(data);
    res.end();
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.approveForvote = async (req, res, next) => {
  let { status, petitionId } = req.body;
  let filter = { _id: petitionId };
  let update = { status: petitionStatus.voting, canvote: true };
  try {
    const result = await petition.updateOne(filter, update);
    sendSuccessResponse(res, { result });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.finalApprove = async (req, res, next) => {
  const totalTeacher = 10;
};

exports.rejectPetition = async (req, res, next) => {
  let { owner } = req.body;
  let filter = { "owner._id": owner._id };
  let update = { status: "ปฏิเสธ" };
  try {
    const result = await petition.updateOne(filter, update);
    sendSuccessResponse(res, { result });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
