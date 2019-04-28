const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");
const mongooseStringQuery = require("mongoose-string-query");

const UserScheme = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    trim: true
  }
});

UserScheme.plugin(timestamp);
UserScheme.plugin(mongooseStringQuery);
const User = mongoose.model("User", UserScheme);

module.exports = User;
