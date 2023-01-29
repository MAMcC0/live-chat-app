const { Schema, model, Types } = require('mongoose');

const conversationSchema = new Schema ({
    recipients: [
        {type: Schema.Types.ObjectId, ref: 'user'}
    ],

    date: {
        type: String,
        default: Date.now
    },
});

const Conversation = model('Conversation', conversationSchema);

module.exports = Conversation;