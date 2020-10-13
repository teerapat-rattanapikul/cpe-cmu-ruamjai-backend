const {
  sendSuccessResponse,
  sendErrorResponse,
  apiError,
} = require("../helpers/apiResponse");

const petition = require("../database/model/petition");
const user = require("../database/model/user");
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
    const token = genJWT(USER.id);
    sendSuccessResponse(res, { token, USER });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

exports.doSomething = async (req, res, next) => {
  console.log(req.userId);
  sendSuccessResponse(res, "do something");
};

// admin

exports.approveForvote = async (req, res, next) => {
  let { petitionId } = req.body;
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
  try {
    let { petitionId } = req.body;
    const result = await petition.findByIdAndUpdate(
      { _id: petitionId },
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
    sendSuccessResponse(res, error);
  }
};

exports.rejectPetition = async (req, res, next) => {
  let { petitionId } = req.body;
  let filter = { _id: petitionId };
  let update = { status: petitionStatus.reject };
  try {
    const result = await petition.updateOne(filter, update);
    sendSuccessResponse(res, { result });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
