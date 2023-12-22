const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/task-manager', { useNewUrlParser: true, useUnifiedTopology: true });

// Routes
const taskRoutes = require('./routes/task.routes');
const userRoutes = require('./routes/user.routes');
const commentRoutes = require('./routes/comment.routes');

app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);
app.use('/comments', commentRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
