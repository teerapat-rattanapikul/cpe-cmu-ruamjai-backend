const {
  sendSuccessResponse,
  sendErrorResponse,
  apiError,
} = require("../helpers/apiResponse");

const petitionStatus = require("../database/model/petitionStatus");
const petition = require("../database/model/petition");
const user = require("../database/model/user");
const { updateStatus } = require("../database/model/petitionStatus");

exports.approveVote = async (req, res, next) => {
  try {
    const result = await petition.updateOne(
      { _id: req.body.petID },
      {
        $set: {
          canVote: true,
        },
      },
      { new: true }
    );
    updateStatus(req.body.petID, petitionStatus.voting);
    sendSuccessResponse(res, { result });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
