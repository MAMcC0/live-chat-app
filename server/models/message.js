const { Schema, model, Types } = require('mongoose');


const messageSchema = new Schema({
    messageBody:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
},
    isRead:{
        type:Boolean
    },

});

const Message = model('Workout', workoutSchema);

module.exports = Message;