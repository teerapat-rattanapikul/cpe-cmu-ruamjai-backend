exports.approved = "อนุมัติ";
exports.voting = "กำลังโหวต";
exports.waiting_for_approved = "กำลังรอการนำไปสู่การอนุมัติ";
exports.waiting_for_voting = "กำลังรอการนำไปสู่การโหวต";
exports.reject = "ปฏิเสธ";
const petition = require("./petition");

exports.updateStatus = async (petitionId, status) => {
  var canVote = false;
  if (status === this.voting) canVote = true;
  try {
    const result = await petition.updateOne(
      { _id: petitionId },
      {
        $set: {
          status,
          canVote: canVote,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};
