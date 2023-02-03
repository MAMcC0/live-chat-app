const express = require('express');
const {signToken} = require('../utils/auth');
const mongoose = require('mongoose');
const router = express.Router();

const {Message, Conversation, User} = require('../models/index');


//get all conversaations for a user
//create a new conversation
// delete a conversation
// get one conversation

//get all conversations for a user
router.get('./conversations', async (req, res) =>  {
    //may have to access id differently
    // will have to seed and check for memory overuse of 100 RAM
    let user = mongoose.Types.ObjectId(signToken._id);

    if(signToken){
        try{
            //use aggregation pipline that refers to user model for recipients from
            //logged in user
            userConversationData = await Conversation.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'recipients',
                        foreignField: "_id",
                        as: "conversationObj"
                    },
                },
            ]).match({
                //all recipients that match the user id established on line 17
                recipients: {
                    $all: [{
                        $elemMatch: {
                            $eq: user
                        }
                    }]
                }
            }).project({
                //exclude password and mongo version number from results
                'conversationObj.password': 0,
                'conversationObj.__v': 0,
            }).exec((err, conversations) => {
                if (err) {
                    console.log(err);
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({message:'failure'}));
                    res.sendStatus(500);
                } else {
                    res.send(conversations);
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
                  sender: signToken._id,
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

router.delete('/conversation/:id', async (req, res) => {
    if(signToken){
        try{
            let deletedConversation = await Conversation.deleteOne(
                {_id: req.body._id}
            )
            return res.status(200).json({message:"Conversation successfully deleted!"})
        } catch (err) {
           return res.status(400).json(err);
        }
    } else {
        return res.status(500).json({message: "Please log in to access this content!"});
    }
});

module.exports = router;