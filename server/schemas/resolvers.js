// importin data
const { AuthenticationError} = require('apollo-server-express');
const { User, Message } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {

    Query: {

        me: async (parent, args, context) => {
            if (context.user){
                return User.findOne({ _id: context.user_id })
            }

            throw new AuthenticationError ("Please log in!")
        },

        listAllUserMessages: async (parent, {_id}) => {
            return Message.find(
                {_id: _id}
            ).populate('user');
        }
    },

    Mutation: {
        

        newMessage: async (parent, {messageContent}, context) => {
            try{
                if (context.user){
                    const messageData = await Message.create(
                        { messageBody: messageContent.messageBody, recipient: messageContent.recipient}
                    )

                    let updatedMessageData = await Message.findOneAndUpdate(
                        {_id: messageData._id},
                        { new: true},
                    ).populate('messages')

                    const addtoUser = await User.findOneAndUpdate(
                        {_id: context.user._id},
                        { $push: {messages: updatedMessageData._id}},
                        { new: true}
                    )
                    return addtoUser;
                }
            
            } catch (err){
                console.log(err);
                throw new AuthenticationError('Make sure you are logged in')
            }
        },

        removeMessage: async (parent, {_id}, context) => {
            if(context.user){

                const updatedMessageData = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    { $pull: {message: _id}},
                    { new: true}
                ).populate('messages')
                return updatedMessageData
            }
            throw new AuthenticationError('You need to be loggin in!');
        },

        createUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return {token, user}
        },

        login: async (parent, {email, password}) => {

            const user = await User.findOne({ email });

            if(!user){
                throw new AuthenticationError('Whoops! Wrong email')
            }

            const correctPassword = await user.isCorrectPassword(password);

            if (!correctPassword) {
                throw new AuthenticationError ('Whoops! Wrong password')
            }

            const token = signToken(user);

            return { token, user }
        },

        deleteUser: async (parent, {_id}) => {

            const user = await User.destroy(
                { _id },
                {new: true}
            );

            return user;
        },
    }
};

module.exports = resolvers;
