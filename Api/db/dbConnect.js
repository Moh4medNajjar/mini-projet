const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/TaskManager2')
    .then(() => {
        console.log("Successfully connected to the database!");
    })
    .catch((err) => {
        console.error("Failed to connect to the database:", err);
    });


