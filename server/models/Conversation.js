const { Schema, model, Types } = require('mongoose');

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

const Conversation = model('Conversation', conversationSchema);

module.exports = Conversation;