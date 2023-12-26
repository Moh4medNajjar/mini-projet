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
  try {
    const data = req.body;
    const userEmail = data.email;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      console.log("Email not found");
      return res.status(401).json({ error: 'Email or password is incorrect' });
    }

    const isValidPassword = bcrypt.compareSync(data.password, user.password);
    if (!isValidPassword) {
      console.log("Password is incorrect");
      return res.status(401).json({ error: 'Email or password is incorrect' });
    }

    const payload = {
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      _id: user._id,
    };

    const token = jwt.sign(payload, '123456789', { expiresIn: '1h' }); // Use a more secure secret key

    console.log(`Successfully connected to your account, welcome ${user.username}`);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



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

router.get('/getbyemail/:email', (req, res) => {

  User.findOne({email: req.params.email}).then((foundUser) => {
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