const express = require('express');
const bodyParser = require('body-parser');
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');
const schema = require('./schema');

// Authentication
const {authenticate} = require('./authentication');

// Dataloaders
const buildDataloaders = require('./dataloaders');

// Error handling
const formatError = require('./formatError');

//Subscription packages
const {execute, subscribe} = require('graphql');
const {createServer} = require('http');
const {SubscriptionServer} = require('subscriptions-transport-ws');


const connectMongo = require('./mongo-connector');

return connectMongo().then((mongo) => {

  var app = express();
  const PORT = 3000;

  const buildOptions = (req, res) => {
    return authenticate(req, mongo.Users).then(user => {
      return {
        context: {
          mongo, 
          user,
          dataloaders: buildDataloaders(mongo)
        }, // This context object is passed to all resolvers.
        formatError,
        schema,
      };
    });
  };
  app.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions));

  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    passHeader: `'Authorization': 'bearer token-julian.pittas@gmail.com'`,
    subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
  }));

  
  const server = createServer(app);
  server.listen(PORT, () => {
    SubscriptionServer.create(
      {execute, subscribe, schema},
      {server, path: '/subscriptions'}
    );
    console.log(`Hackernews GraphQL server running on port ${PORT}.`)
  });

});