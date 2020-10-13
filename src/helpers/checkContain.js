exports.checkContain = (petition, petitionId) => {
  const res = petition.find((elem) => {
    return elem.toString() === petitionId;
  });
  if (res !== undefined) return true;
  else return false;
};
