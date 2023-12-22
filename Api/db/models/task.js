const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  email: String,
});

const commentSchema = new mongoose.Schema({
  user: userSchema,
  timestamp: { type: Date, default: Date.now },
  text: String,
  edited: { type: Boolean, default: false },
});

const taskSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true, unique: true },
  description: String,
  due_date: Date,
  owner: userSchema,
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
  category: String,
  participants: [userSchema],
  comments: [commentSchema],
  attachments: [String],
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
