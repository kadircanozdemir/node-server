const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const NewsScheme = new mongoose.Schema({
  image: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ["SPOR", "POLITIKA", "EKONOMI", "BILIM", "SANAT", "CEVRE"]
  },
  likes: {
    type: [String],
    default: []
  },
  dislikes: {
    type: [String],
    default: []
  },
  views: {
    type: [String],
    default: []
  }
});

NewsScheme.plugin(timestamp);
const News = mongoose.model("News", NewsScheme);

module.exports = News;
