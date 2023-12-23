const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  due_date: Date,
  owner: userSchema,
  priority: String,
  status: String,
  category: String,
  participants: [userSchema],
  comments: [commentSchema],
  attachments: [String],
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
