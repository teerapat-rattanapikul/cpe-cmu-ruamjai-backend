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

exports.login = async (req, res, next) => {
  try {
    const userName = req.body.username;
    const passWord = req.body.password;
    const USER = await user.findOne({ username: userName });
    if (USER === null) {
      sendSuccessResponse(res, "wrong username");
    } else if (USER.password !== passWord) {
      sendSuccessResponse(res, "wrong password");
    }

    const token = genJWT(USER);
    sendSuccessResponse(res, { token, USER });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
exports.doSomething = async (req, res) => {
  res.json("do somthring");
};
exports.votePetition = async (req, res, next) => {
  let { petitionId } = req.body;
  try {
    const result = await petition.findByIdAndUpdate(
      { _id: petitionId },
      {
        $inc: {
          voteNum: 1,
        },
      },
      { new: true }
    );
    console.log(result);
    if (result.voteNum > 4) {
      updateStatus(petitionId, petitionStatus.waiting_for_approved);
    }
    sendSuccessResponse(res, { result });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.addPetition = async (req, res, next) => {
  let { owner, type, detail, subDetail } = req.body;
  try {
    const person = await user.findById(owner);
    const result = await petition.create({
      type: type,
      owner: owner,
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
  console.log(userId);
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

  let update = { status: petitionStatus.voting, canVote: true };
  if (req.role === "admin") {
    try {
      const result = await petition.updateOne(filter, { $set: update });
      sendSuccessResponse(res, { result });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  } else {
    sendSuccessResponse(res, "ไม่สามารถทำการอนุมัติได้");
  }
};

exports.finalApprove = async (req, res, next) => {
  const totalTeacher = 10;
  if (req.role === "admin") {
    try {
      let { petitionId } = req.body;
      console.log(petitionId);
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
  } else sendSuccessResponse(res, "ไม่สามารถทำการอนุมัติได้");
};

exports.rejectPetition = async (req, res, next) => {
  let { petitionId } = req.body;
  let filter = { _id: petitionId };
  let update = { status: petitionStatus.reject };
  if (req.role === "admin") {
    try {
      const result = await petition.updateOne(filter, update);
      sendSuccessResponse(res, { result });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  } else sendSuccessResponse(res, "ไม่สามารถทำการอนุมัติได้");
};
