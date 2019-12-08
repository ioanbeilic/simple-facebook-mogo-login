const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    name: String,
    faceBookID: String,
    accessToken: String
  },
  {
    collection: "users"
  }
);

const model = mongoose.model("user", Schema);
module.exports = model;
