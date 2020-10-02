exports.approved = "อนุมัติ";
exports.voting = "กำลังโหวต";
exports.waiting_for_approved = "กำลังรอการนำไปสู่การอนุมัติ";
exports.waiting_for_voting = "กำลังรอการนำไปสู่การโหวต";
exports.reject = "ปฏิเสธ";
const petition = require("./petition");

exports.updateStatus = async (petitinId, status) => {
  try {
    const result = await petition.updateOne(
      { _id: petitinId },
      {
        $set: {
          status,
        },
      }
    );
    sendSuccessResponse(res, { result });
  } catch (error) {
    sendSuccessResponse(res, error);
  }
};
