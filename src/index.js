const express = require('express');
const bodyParser = require('body-parser');
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');
const schema = require('./schema');
const {authenticate} = require('./authentication');
const buildDataloaders = require('./dataloaders');

// 1
const connectMongo = require('./mongo-connector');

return connectMongo().then((mongo) => {

  var app = express();

  const buildOptions = (req, res) => {
    return authenticate(req, mongo.Users).then(user => {
      return {
        context: {
          mongo, 
          user,
          dataloaders: buildDataloaders(mongo)
        }, // This context object is passed to all resolvers.
        schema,
      };
    });
  };
  app.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions));

  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    passHeader: `'Authorization': 'bearer token-julian.pittas@gmail.com'`,
  }));

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Hackernews GraphQL server running on port ${PORT}.`)
  });

});