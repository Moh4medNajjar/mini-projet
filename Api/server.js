const express = require('express');
const cors = require('cors');
require('./db/dbConnect')

const app = express();
app.use(cors());
app.use(express.json()); 
const port = 3000;
const userApi = require('./routes/user');
const taskApi = require('./routes/task')
const commentApi = require('./routes/comment')
app.use('/user', userApi) 
app.use('/task', taskApi) 
app.use('/comment', commentApi) 
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});