// importin data
const { AuthenticationError} = require('apollo-server-express');
const { User, Message, Conversation } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {

    Query: {

        me: async (parent, args, context) => {
            if (context.user){
                return User.findOne({ _id: context.user_id })
            }

            throw new AuthenticationError ("Please log in!")
        },

        listAllUserConversations: async (parent, {_id}) => {
            return User.find(
                {_id: _id}
            ).populate({path: 'conversations', populate: {path: 'messages'}});
        }
    },

    Mutation: {
        
        newConversation: async (parent, {conversationContent}, context) => {
            try {
                if(context.user){
                    const conversationData = await Conversation.create(
                        { users: conversationContent.users}
                    )

                    let updatedConversationData = await Conversation.findOneAndUpdate(
                        {_id: conversationData._id},
                        { new: true},
                    ).populate('conversation')

                    const addtoUserConversations = await User.findOneAndUpdate(
                        {_id:context.user._id},
                        { $push: {conversation: updatedConversationData._id}},
                        { new: true}
                    )

                    return addtoUserConversations;
                }
            } catch (err){
                console.log(err)
                throw new AuthenticationError ('Make sure you are logged in!')
            }
        },

        deleteConversation: async (parent, {_id}, context) => {
                if(context.user){
                    const updatedConversationData = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    { $pull: {conversation: _id}},
                    { new: true}
                ).populate('conversation')
                return updatedConversationData
                    
                }
            
        },

        newMessage: async (parent, {messageContent}, context) => {
            try{
                if (context.user){
                    const messageData = await Message.create(
                        { messageBody: messageContent.messageBody}
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
                ).populate('message')
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
