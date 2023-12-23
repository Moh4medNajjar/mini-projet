const express = require('express');
const cors = require('cors');
require('./db/dbConnect')

const app = express();
app.use(cors());
app.use(express.json()); 
const port = 3000;
const userApi = require('./routes/user')
app.use('/user', userApi) 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});