const petitons = require("../database/model/petition");
const status = require("../database/model/petitionStatus");
exports.splitCategory = (data) => {
  var category = {
    approved: [],
    voting: [],
    waiting_for_approved: [],
    waiting_for_voting: [],
    reject: [],
  };
  data.forEach((element) => {
    if (element.status === status.approved) category.approved.push(element);
    else if (element.status === status.voting) category.voting.push(element);
    else if (element.status === status.waiting_for_approved)
      category.waiting_for_approved.push(element);
    else if (element.status === status.waiting_for_voting) {
      category.waiting_for_voting.push(element);
    } else if (element.status === status.reject) category.reject.push(element);
  });

  return category;
};
