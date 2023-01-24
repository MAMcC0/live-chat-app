const { Schema, model, Types } = require('mongoose');


const messageSchema = new Schema({
    messageBody:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
},
    recipient: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    sender:  [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
});

const Message = model('Workout', workoutSchema);

module.exports = Message;