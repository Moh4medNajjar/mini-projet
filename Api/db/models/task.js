const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: String,
  due_date: Date,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
  category: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  attachments: [String],
});


const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
