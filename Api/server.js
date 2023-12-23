const express = require('express');
const cors = require('cors');
require('./db/dbConnect')

const app = express();
app.use(cors());
app.use(express.json()); 
const port = 3000;
const userApi = require('./routes/user');
const CommentRoutes = require('./routes/comment');
app.use('/user', userApi) 
app.use('/comment',CommentRoutes); 
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});