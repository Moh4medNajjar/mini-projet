const mongoose = require('mongoose'); 

mongoose.connect('mongodb://localhost:27017/TaskManager2')
    .then(() => {
        console.log("Succesfully connected to the database !");
    })
    .catch((err) => {
        console.log("Failed to connect to the database :(")
    })


module.exports = mongoose ;

