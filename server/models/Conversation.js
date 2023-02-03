const { Schema, model, Types } = require('mongoose');
const Message = require('./message');
const User = require('./User');

const conversationSchema = new Schema ({
    isGroupChat: {
        type: Boolean,
        default: false
    },

    users: [
        {type: Schema.Types.ObjectId, ref: 'user'}
    ],

    messages: [{
        type:Schema.Types.ObjectId, ref: 'message'
    }],
});


conversationSchema.pre("deleteOne", document => {
    const conversationId = document._id;
    User.find({ conversations:
    {$in: [conversationId]}
    }).then(users => {
        Promise.all(
            users.map( user =>
                User.findOneAndUpdate(
                 user._id,
                 { $pull: {conversations: conversationId}},
                 { new: true}   
                ))
        );
    });
});

const Conversation = model('Conversation', conversationSchema);

module.exports = Conversation;