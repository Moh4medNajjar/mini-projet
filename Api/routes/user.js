const express = require('express');
const bcrypt = require('bcrypt'); 
const router = express.Router(); 
const User = require('../db/models/user');
const jwt = require('jsonwebtoken')

router.post('/register', (req, res) => {
    let data = req.body; 
    let newUser = new User(data);
    salt = bcrypt.genSaltSync(10); 
    cryptedPass = bcrypt.hashSync(data.password, salt);

    newUser.password = cryptedPass; 

    newUser.save().then((newUser) => {
        console.log("new user added ! "); 
        res.status(200).send(newUser)
    }).catch((err) => {
        console.log("Failed to add user :("); 
        res.status(400).send(err); 
    })
})

router.post('/login', async (req, res) => {
    let data = req.body; 
    let userEmail = data.email; 
    let usr = await User.findOne({email: userEmail});
    
    if(!usr){
        console.log("Email or password invalid !")
    } else{
        isValid = bcrypt.compareSync(data.password, usr.password)
        if(!isValid){
            console.log("Email or password Invalid");
        } else {
            payload = {
                email: usr.email,
                _id: usr._id
            }
            usr.token = jwt.sign(payload, '123456');
            console.log(`Successfully connected to your account, welcome ${usr.username}`);
            res.status(200).send({token: usr.token})
        }
    }
})

router.get('/all', (req, res) => {
    User.find({}).then((allUsers) => {
        res.status(200).send(allUsers)
    }).catch((err) => {
        res.status(400).send(err)
    })
})

router.get('/getbyid/:id', (req, res) => {

    User.findOne({_id: req.params.id}).then((foundUser) => {
        res.status(200).send(foundUser);
        console.log("user found !")
    }).catch((err) => {
        res.status(400).send(err)
    })
})

router.delete('/delete/:id', (req, res) => {
    let id = req.params.id; 
    User.findOneAndDelete({_id: id}).then((deletedUser) => {
        res.status(200).send(deletedUser); 
    }).catch((err) => {
        res.status(400).send(err)
    })
})


router.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;
  
    User.findOneAndUpdate({ _id: id }, data, { new: true })
      .then((updatedUser) => {
        if (!updatedUser) {
          console.log(`User with ID ${id} not found`);
          return res.status(404).send("User not found");
        }
  
        console.log(`User with ID ${id} updated successfully`);
        res.status(200).send(updatedUser);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        res.status(500).send("Internal Server Error");
      });
  });

module.exports = router