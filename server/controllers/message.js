const express = require('express');
const {signToken} = require('../utils/auth');
const mongoose = require('mongoose');
const router = express.Router();

const {Message, Conversation, User} = require('../models/index');


// get all messages for a conversation
// send a message
// get message from a conversation based on search

//get all messages for a single conversation
router.get('/conversation/:id/messages', async (req, res) => {
    if(signToken){
        try {
          const conversationData = await Conversation.findById(req.body._id)
            .populate({path: 'message'})
            return res.status(200).json(conversationData);
        } catch(err) {
            res.status(400).json(err);
        };
    } else {
        res.status(400).json({message: "You need to be logged in!"});

    };
});

//create a new message in the database
router.post("./conversation/new-message", async (req, res) => {
    if(signToken){
        try {
            //should this be findOneandUpdate for conversation?
            let message = Message.create({
                message: req.body.messageBody,
                sender: signToken._id
            })
            return res.status(200).json(message);
        } catch (err){
            return res.status(400).json(err);
        };
    }else {
        return res.status(400).json({message: "You need to be logged in to send a message!"})
    }
});

router.get('/conversation/search', (req, res) => {

})