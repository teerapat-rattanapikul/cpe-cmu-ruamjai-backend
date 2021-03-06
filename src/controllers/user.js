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

exports.adminTeacherGetPetitions = async (req, res, next) => {
  let { role } = req;
  try {
    if (role === "admin") {
      const result = await petition.find({
        status: petitionStatus.waiting_for_voting,
      });
      sendSuccessResponse(res, { result });
    } else if (role === "teacher") {
      const result = await petition.find({
        status: petitionStatus.waiting_for_approved,
      });
      sendSuccessResponse(res, { result });
    } else {
      sendSuccessResponse(res, {});
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.votePetition = async (req, res, next) => {
  let { petitionId } = req.body;
  let { userId } = req;
  try {
    const person = await user.findById(userId);
    const check = checkContain(person.votedPetitions, petitionId);
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
      if (result.voteNum > 2) {
        updateStatus(petitionId, petitionStatus.waiting_for_approved);
      }
      person.votedPetitions.unshift(result._id);
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
      rejectNum: 0,
      approveNum: 0,
      rejectReason: "",
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
  const totalTeacher = 3;
  let { role, userId } = req;
  let { petitionId } = req.body;
  const person = await user.findById(userId);
  const check = checkContain(person.approvedPetitions, petitionId);
  try {
    if (role === "teacher" && check === false) {
      const result = await petition.findByIdAndUpdate(
        petitionId,
        {
          $inc: {
            approveNum: 1,
          },
        },
        { new: true }
      );
      person.approvedPetitions.unshift(result._id);
      await person.save();
      if (result.approveNum >= totalTeacher * 0.8) {
        updateStatus(petitionId, petitionStatus.approved);
      }
      sendSuccessResponse(res, { result });
    } else sendErrorResponse(res);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.finalReject = async (req, res, next) => {
  const totalTeacher = 3;
  let { petitionId } = req.body;
  let { role, userId } = req;
  let reject = { rejectReason: "ไม่ผ่านการลงคะแนนของอาจารย์" };
  const person = await user.findById(userId);
  const check = checkContain(person.approvedPetitions, petitionId);
  try {
    if (role === "teacher" && check === false) {
      const result = await petition.findByIdAndUpdate(
        petitionId,
        {
          $inc: {
            rejectNum: 1,
          },
        },
        { new: true }
      );
      person.approvedPetitions.unshift(result._id);
      await person.save();
      if (result.rejectNum >= totalTeacher * 0.8) {
        updateStatus(petitionId, petitionStatus.reject);
        const resultReject = await petition.updateOne(
          { _id: req.body.petitionId },
          reject
        );
        sendSuccessResponse(res, { resultReject });
      } else {
        sendSuccessResponse(res, { result });
      }
    } else {
      sendErrorResponse(res);
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.rejectPetition = async (req, res, next) => {
  let { petitionId, reason } = req.body;
  let filter = { _id: petitionId };
  let update = { status: petitionStatus.reject, rejectReason: reason };
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
