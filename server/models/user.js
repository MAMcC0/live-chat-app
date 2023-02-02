const { Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema ({
    email:{
        type: String,
        required: true,
        unique:true,
        match:[/.+@.+\..+/, 'Must match an email address!'],
    },
    avatar:{
        type: String,
        required: false
    }, 
    isImageSet:{
        type: Boolean,
        default: false
    },
    username:{
        type: String,
        required: true,
        min: 4,
        max: 25,
        unique:true,
        trim: true,

    },
    password: {
        type: String,
        required: true,
        minlength: 10,
    },
    online:{
        type:Boolean
    },
    
});

//Hashing the user's password for security
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

// Function to check user password on sign in with bcrypt password
userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
}

const User = model('User', userSchema)

module.exports = User;