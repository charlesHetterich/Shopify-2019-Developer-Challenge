const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema.js');

//Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', expressGraphQL({
    schema: schema,
    //rootValue: root,
    graphiql: true
}));

app.listen(4000, () => console.log('Express GraphQL Now Running on localhost:4000/graphql'));