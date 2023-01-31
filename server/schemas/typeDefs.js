const { gql } = require('apollo-server-express');

const typeDefs = gql `


type User {
    _id: ID
    username: String
    email: String
    photo: String
    online: Boolean
    conversations: [Conversation]
}

type Conversation {
    _id: ID
    users: [User]
    messages: [Message]
}

type Message {
    _id: ID
    messageBody: String
    isRead: Boolean
}

input MessageInput {
    messageBody: String!
    recipient: [String!]
}

type Auth {
    token: ID!
    user: User
  }

type Query {
    me: User
    listAllUserConversations(_id:ID!): [Conversation]
# potentially need to add a get all friends function and add friends to Users model?
}

type Mutation {
    createUser(username: String!, email: String!, password: String!) : Auth
    deleteUser(_id: String!) : User
    login(email: String, password: String) : Auth
    newConversation(conversationContent: conversationInput) : User
    deleteConversation(_id:ID!) : Auth
    newMessage(messageContent: MessageInput) : User
    removeMessage(_id:ID!): Auth

}
`
module.exports = typeDefs;