const express = require('express');
const {signToken} = require('../utils/auth');
const mongoose = require('mongoose');
const router = express.Router();

const {Message, Conversation, User} = require('../models/index');

router.get('/conversation/:id/messages', async (req, res) => {
    if(signToken){
        try {
          const conversationData = await Conversation.findById({_id:req.body._id})
            .populate({path: 'messages'})
            return res.status(200).json(conversationData);
        } catch(err) {
            res.status(400).json(err);
        };
    } else {
        res.status(400).json({message: "You need to be logged in!"});

    };
});

//create a new message in the database
router.post("./conversation/:id/new-message", async (req, res) => {
    if(signToken){
        try {
            //should this be findOneandUpdate for conversation?
            let message = Message.create({
                message: req.body.messageBody,
                sender: signToken._id
            })
                let updatedUser = await User.findOneAndUpdate(
                    {_id: req.body.recipientId},
                    {$where: {_id: req.body.conversationId}},
                    {$push: {messages: message}},
                    { new: true},
                ).populate({path:'messages'})
            
            return res.status(200).json(updatedUser);
        } catch (err){
            return res.status(400).json(err);
        };
    }else {
        return res.status(400).json({message: "You need to be logged in to send a message!"})
    }
});


module.exports = router;