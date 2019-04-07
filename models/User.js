const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const UserScheme = new mongoose.Schema({
  image: {
    type: String,
    required: true,
    trim: true
  }
});

UserScheme.plugin(timestamp);
const User = mongoose.model("User", UserScheme);

export default User;
