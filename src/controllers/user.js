const {
  sendSuccessResponse,
  sendErrorResponse,
  apiError,
} = require("../helpers/apiResponse");
const { splitCategory } = require("../helpers/splitCategory");
const petition = require("../database/model/petition");
const user = require("../database/model/user");
const petitionStatus = require("../database/model/petitionStatus");
const { updateStatus } = require("../database/model/petitionStatus");
const petitionTypes = require("../database/model/petitionTypes");
const genJWT = require("../services/genJWT");
const { checkContain } = require("../helpers/checkContain");

exports.login = async (req, res, next) => {
  try {
    const userName = req.body.username;
    const passWord = req.body.password;
    const USER = await user.findOne({ username: userName });
    if (USER === null) {
      sendErrorResponse(res, error);
    } else if (USER.password !== passWord) {
      sendErrorResponse(res, error);
    }
    const token = genJWT({
      userId: USER.id,
      role: USER.role,
    });
    sendSuccessResponse(res, { token, USER });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
exports.getMyProfile = async (req, res, next) => {
  let { userId } = req;
  try {
    const data = await user.findById(userId).select("-password");
    sendSuccessResponse(res, { data });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.votePetition = async (req, res, next) => {
  let { petitionId } = req.body;
  let { userId } = req;
  console.log(userId);
  try {
    const person = await user.findById(userId);
    const check = checkContain(person.votedPetitoins, petitionId);
    if (!check) {
      const result = await petition.findByIdAndUpdate(
        { _id: petitionId },
        {
          $inc: {
            voteNum: 1,
          },
        },
        { new: true }
      );
      if (result.voteNum > 4) {
        updateStatus(petitionId, petitionStatus.waiting_for_approved);
      }
      person.votedPetitoins.unshift(result._id);
      await person.save();
      sendSuccessResponse(res, { result });
    } else {
      sendErrorResponse(res, error);
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.addPetition = async (req, res, next) => {
  let { type, detail, subDetail } = req.body;
  let { userId } = req;
  try {
    const person = await user.findById(userId);
    const result = await petition.create({
      type: type,
      owner: userId,
      detail: detail,
      sub_detail: subDetail,
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
};

exports.getMyPetitions = async (req, res, next) => {
  let { userId } = req;
  let filter = { owner: userId };
  try {
    const result = await petition.find(filter);
    const petitions = splitCategory(result);
    sendSuccessResponse(res, { petitions });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
// admin //

exports.approveForvote = async (req, res, next) => {
  let { petitionId } = req.body;
  let filter = { _id: petitionId };
  let { role } = req;
  let update = { status: petitionStatus.voting, canVote: true };
  if (role === "admin") {
    try {
      const result = await petition.updateOne(filter, { $set: update });
      sendSuccessResponse(res, { result });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  } else {
    sendErrorResponse(res, error);
  }
};

exports.finalApprove = async (req, res, next) => {
  const totalTeacher = 10;
  let { role } = req;
  if (role === "admin") {
    try {
      let { petitionId } = req.body;
      const result = await petition.findByIdAndUpdate(
        petitionId,
        {
          $inc: {
            approveNum: 1,
          },
        },
        { new: true }
      );
      console.log(result);
      if (result.approveNum >= totalTeacher * 0.8) {
        updateStatus(petitionId, petitionStatus.approved);
      }
      sendSuccessResponse(res, { result });
    } catch (error) {
      console.log(error);
      sendSuccessResponse(res, error);
    }
  } else sendErrorResponse(res, error);
};

exports.rejectPetition = async (req, res, next) => {
  let { petitionId } = req.body;
  let filter = { _id: petitionId };
  let update = { status: petitionStatus.reject };
  let { role } = req;
  if (role === "admin") {
    try {
      const result = await petition.updateOne(filter, update);
      sendSuccessResponse(res, { result });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  } else sendErrorResponse(res, error);
};
