const {
  sendSuccessResponse,
  sendErrorResponse,
  apiError,
} = require("../helpers/apiResponse");

const petitionStatus = require("../database/model/petitionStatus");
const petitionTypes = require("../database/model/petitionTypes");
const petition = require("../database/model/petition");
const user = require("../database/model/user");

exports.getAllPetitionsVoting = async (req, res, next) => {
  try {
    const result = await petition.find({ status: petitionStatus.voting });
    sendSuccessResponse(res, { result });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
exports.getPetitionType = (req, res) => {
  sendSuccessResponse(res, { petitionTypes });
};
//getrecent5petition
exports.getRecentPetitions = async (req, res, next) => {
  try {
    const result = await petition
      .find({ status: petitionStatus.voting })
      .sort({ createdDate: -1 })
      .limit(10);
    sendSuccessResponse(res, { result });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
//

const { updateStatus } = require("../database/model/petitionStatus");
const { splitCategory } = require("../helpers/splitCategory");
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

exports.filterPetitions = async (req, res, next) => {
  let { types } = req.body;
  let filter = { type: { $in: types }, canVote: true };
  try {
    const result = await petition.find(filter);
    sendSuccessResponse(res, { result });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
