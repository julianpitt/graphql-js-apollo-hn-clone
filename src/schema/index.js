const {makeExecutableSchema} = require('graphql-tools');
const resolvers = require('./resolvers');

// Define your types here.
const typeDefs = `

  input TestSubscriptionFilter {
    mutation_in: [_ModelMutationType!]
  }

  input VoteSubscriptionFilter {
    mutation_in: [_ModelMutationType!]
  }
  
  input LinkSubscriptionFilter {
    mutation_in: [_ModelMutationType!]
  }

  type TestSubscriptionPayload {
    mutation: _ModelMutationType!
    node: Test
  }

  type VoteSubscriptionPayload {
    mutation: _ModelMutationType!
    node: Vote
  }

  type LinkSubscriptionPayload {
    mutation: _ModelMutationType!
    node: Link
  }

  enum _ModelMutationType {
    CREATED
    UPDATED
    DELETED
  }

  type Test {
    id: ID!
    test: String!
    link: Link!
  }

  type Vote {
    id: ID!
    user: User!
    link: Link!
  }

  type Link {
    id: ID!
    url: String!
    description: String!
    postedBy: User
    votes: [Vote!]
  }
  
  type Query {
    allLinks(filter: LinkFilter, skip: Int, first: Int): [Link!]!
    allVotes: [Vote!]!
    allTests: [Test!]!
  }

  input LinkFilter {
    OR: [LinkFilter!]
    description_contains: String
    url_contains: String
  }

  type Mutation {
    createVote(linkId: ID!): Vote
    createTest(test: String!, linkId: ID!): Test
    createLink(url: String!, description: String!): Link
    createUser(name: String!, authProvider: AuthProviderSignupData!): User
    signinUser(credentials: AUTH_PROVIDER_EMAIL): SigninPayload
    removeAll: String
    removeAllLinks: String
    removeAllTests: String
  }

  type Subscription {
    Vote(filter: VoteSubscriptionFilter): VoteSubscriptionPayload
    Link(filter: LinkSubscriptionFilter): LinkSubscriptionPayload
    Test(filter: TestSubscriptionFilter): TestSubscriptionPayload
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