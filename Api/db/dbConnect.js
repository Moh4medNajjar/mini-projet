const mongoose = require('mongoose'); 

mongoose.connect('mongodb://127.0.0.1/27017/TaskManager')
    .then(() => {
        console.log("Succesfully connected to the database !");
    })
    .catch((err) => {
        console.log("Failed to connect to the database :(")
    })


module.exports = mongoose ;