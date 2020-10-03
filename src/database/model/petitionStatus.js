exports.approved = "อนุมัติ";
exports.voting = "กำลังโหวต";
exports.waiting_for_approved = "กำลังรอการนำไปสู่การอนุมัติ";
exports.waiting_for_voting = "กำลังรอการนำไปสู่การโหวต";
exports.reject = "ปฏิเสธ";
const petition = require("./petition");

exports.updateStatus = async (petitionId, status) => {
  try {
    const result = await petition.updateOne(
      { _id: petitionId },
      {
        $set: {
          status,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};
