const {makeExecutableSchema} = require('graphql-tools');
const resolvers = require('./resolvers');

// Define your types here.
const typeDefs = `

  input LinkSubscriptionFilter {
    mutation_in: [_ModelMutationType!]
  }

  input VoteSubscriptionFilter {
    mutation_in: [_ModelMutationType!]
  }

  type LinkSubscriptionPayload {
    mutation: _ModelMutationType!
    node: Link
  }

  type VoteSubscriptionPayload {
    mutation: _ModelMutationType!
    node: Vote
  }

  enum _ModelMutationType {
    CREATED
    UPDATED
    DELETED
  }

  type Link {
    id: ID!
    url: String!
    description: String!
    postedBy: User
    votes: [Vote!]
  }

  type Query {
    allLinks: [Link!]!
    allVotes: [Vote!]!
  }

  type Mutation {
    createLink(url: String!, description: String!): Link
    createUser(name: String!, authProvider: AuthProviderSignupData!): User
    signinUser(credentials: AUTH_PROVIDER_EMAIL): SigninPayload
    createVote(linkId: ID!): Vote
    removeAll: String
    removeAllLinks: String
  }

  type Subscription {
    Vote(filter: VoteSubscriptionFilter): VoteSubscriptionPayload
    Link(filter: LinkSubscriptionFilter): LinkSubscriptionPayload
  }

  type User {
    id: ID!
    name: String!
    email: String
    password: String
    votes: [Vote!]
  }

  type SigninPayload {
    token: String
    user: User
  }

  type Vote {
    id: ID!
    user: User!
    link: Link!
  }

  input AuthProviderSignupData {
    credentials: AUTH_PROVIDER_EMAIL
  }

  input AUTH_PROVIDER_EMAIL {
    email: String!
    password: String!
  }
`;

// Generate the schema object from your types definition.
module.exports = makeExecutableSchema({typeDefs, resolvers});