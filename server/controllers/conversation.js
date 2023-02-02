const express = require('express');
const {signToken} = require('../utils/auth');
const mongoose = require('mongoose');
const router = express.Router();

const {Message, Conversation, User} = require('../models/index');
const { rawListeners } = require('../models/Conversation');

//get all conversaations for a user
//create a new conversation
// delete a conversation
// get one conversation

//get all conversations for a user
router.get('./conversations', async (req, res) =>  {
    if(signToken){
        try{
            let userId = signToken.id;
            userConversationData = await Conversation.aggregate([
                {
                    $lookup: {
                        from: 'user',
                        localField: 'recipients',
                        foreignField: '_id',
                        as: 'conversationObj',
                    },
                },
            ]).match({
                recipients:{
                    //may have to change how to get recipients id
                    $all: [{ $elemMatch: {$eq: req.body.user._id}}]
                }
            }).project({
                //look up project method properties
                'conversationObj.password': 0,
                'conversationObj.date': 0,
            }).exec((err, conversations) => {
                if (err) {
                    console.log(err);
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({message:'failure'}));
                    res.sendStatus(500)
                } else {
                    res.send(conversations)
                }
            });

        } catch (err) {
            return res.status(400).json(err);
        }
    }else{
       return res.status(400).json({message: "Please log in!"});
    }
});

//create a new conversation
router.post('./conversations/new', async (req, res) => {
    if(signToken){
        try{
            let newConversation = await Conversation.create(
                { recipients: [req.body.recipientId],
                  sender: req.body.user._id,
                }
            )

            if (newConversation.recipients.length() > 1){
                let updatedConversation = Conversation.findOneAndUpdate(
                    {_id: newConversation._id},
                    { isGroupChat: true},
                    { new: true},
                )
                return res.status(200).json(updatedConversation);
            } else {
                return res.status(200).json(newConversation);
            };
        } catch (err){
            return res.status(500).json(err);
        };
    } else {
        return res.status(400).json({message:"Please log in to make a new conversation"})
    }
});

router.delete('/conversation/:id', async (req, res) =>)