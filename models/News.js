const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");
const mongooseStringQuery = require("mongoose-string-query");

const NewsScheme = new mongoose.Schema({
  image: {
    type: String,
    required: false,
    trim: true
  },
  title: {
    type: String,
    required: false,
    trim: true
  },
  content: {
    type: String,
    required: false,
    trim: true
  },
  category: {
    type: String,
    required: false,
    enum: [
      "SPORTS",
      "POLITICS",
      "BUSINESS",
      "ENTERTAINMENT",
      "CRIME",
      "TRAVEL",
      "TECH"
    ]
  },
  authors: {
    type: String,
    required: false,
    trim: true
  },
  link: {
    type: String,
    required: false,
    trim: true
  },
  release: {
    type: Date,
    required: false,
    default: Date.now
  },
  likes: {
    type: [String],
    required: false,
    default: []
  },
  dislikes: {
    type: [String],
    required: false,
    default: []
  },
  views: {
    type: [String],
    required: false,
    default: []
  }
});

NewsScheme.plugin(timestamp);
NewsScheme.plugin(mongooseStringQuery);
const News = mongoose.model("News", NewsScheme);

module.exports = News;
