const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    username: {
      type: String,
      required: true
    },
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  text: {
    type: String,
    required: true
  },
  edited: {
    type: Boolean,
    default: false
  },
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
