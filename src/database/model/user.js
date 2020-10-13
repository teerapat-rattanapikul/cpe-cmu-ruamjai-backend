const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  role: String,
  code: String,
  petitions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "petitions",
    },
  ],
  votedPetitions: [{ type: mongoose.Schema.Types.ObjectId, ref: "petitions" }],
  approvedPetitions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "petitions" },
  ],
  username: String,
  password: String,
});

module.exports = mongoose.model("users", userSchema);
