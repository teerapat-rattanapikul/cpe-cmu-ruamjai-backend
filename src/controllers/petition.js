const {
  sendSuccessResponse,
  sendErrorResponse,
  apiError,
} = require("../helpers/apiResponse");

const petitionStatus = require("../database/model/petitionStatus");
const petitionTypes = require("../database/model/petitionTypes");
const petition = require("../database/model/petition");

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

exports.getTrendingPetitions = async (req, res, next) => {
  try {
    const result = await petition
      .find({ status: petitionStatus.voting })
      .sort({ voteNum: -1 })
      .limit(10);
    sendSuccessResponse(res, { result });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

//

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

exports.getSearch = async (req, res, next) => {
  let { keyword } = req.body;
  let filter = { "detail.topic": { $regex: keyword, $options: "i" } };
  try {
    const result = await petition.find(filter);
    sendSuccessResponse(res, { result });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
