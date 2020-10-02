const {
  sendSuccessResponse,
  sendErrorResponse,
  apiError,
} = require("../helpers/apiResponse");

const petitionStatus = require("../database/model/petitionStatus");
const petition = require("../database/model/petition");
const user = require("../database/model/user");
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

exports.getMyPetitions = async (req, res, next) => {
  try {
    const result = await petition.find({ owner: req.body.userId });
    const petitions = splitCategory(result);
    sendSuccessResponse(res, { petitions });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.addPetition = async (req, res, next) => {
  try {
    const person = await user.findById(req.body.owner);
    const result = await petition.create({
      type: req.body.type,
      owner: req.body.owner,
      detail: req.body.detail,
      sub_detail: req.body.subDetail,
      createdDate: Date.now(),
      status: petitionStatus.waiting_for_voting,
      voteNum: 0,
      approved: false,
      canVote: false,
    });
    person.petitions.unshift(result._id);
    await person.save();
    sendSuccessResponse(res, { result }, 201);
  } catch (error) {
    sendSuccessResponse(res, error);
  }
  // next();
};

exports.votePetition = async (req, res, next) => {
  try {
    const result = await petition.findByIdAndUpdate(
      { _id: req.body.petID },
      {
        $inc: {
          voteNum: 1,
        },
      },
      { new: true }
    );
    console.log(result);
    if (result.voteNum > 4) {
      updateStatus(req.body.petID, petitionStatus.waiting_for_approved);
    }
    sendSuccessResponse(res, { result });
  } catch (error) {
    sendSuccessResponse(res, error);
  }
};
