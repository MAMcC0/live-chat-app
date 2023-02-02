const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user.js');
const {signToken}= require('../utils/auth');

//Create user
router.post('/signup', async (req,res) => {
    try {
        User.findOne(
            {username: req.body.email}
        ).then((user) => {
            if(user) {
                return res.status(400).json({message: "Username already exists"});

            } 
        })

        User.findOne(
            {email: req.body.email}
        ).then((user) => {
            if(user) {
                return res.status(400).json({message: "An account with that email already exsists"})
            } else {
                const userData = User.create(
                    { username: req.body.username,
                      email: req.body.email,
                      password: req.body.password,
                    //potentially need to add avatar default in model or est here  
                    }
                    );
            }
        signToken({email, username});
        })
    } catch (err) {
        res.status(400).json(err);
    }
});


//route to log in a user
router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const userData = await User.findOne({email}).then((user) => {
            if(!user) {
                return res.status(404).json({ emailnotfound: "Email not found"})
            }

            bcrypt.compare(password, user.password).then((isAMatch) => {
                if (isAMatch){
                    signToken();
                } else {
                    return res.status(400).json({message: "Password Incorrect"});
                }
            });
        })
    } catch (err){
        res.status(400).json(err);
    }
})

//add another User to users contact list
//add contact list to model