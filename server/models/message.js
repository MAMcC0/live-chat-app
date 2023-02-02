const { Schema, model, Types } = require('mongoose');


const messageSchema = new Schema({
    messageBody:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
},
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation'
    },
    isRead:{
        type:Boolean
    },

});

const Message = model('Message', messageSchema);

module.exports = Message;