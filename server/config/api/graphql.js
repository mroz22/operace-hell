'use strict';

const graphqlHTTP = require('express-graphql');
const graphqlSchema = require('../../api/graphql').schema;
const graphqlRoot = require('../../api/graphql').root;

module.exports = (app) => {
  app.use('/api/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlRoot,
    graphiql: true,
  }));
};