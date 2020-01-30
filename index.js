const fs              = require('fs');
const express         = require('express');
const graphqlHTTP     = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } = require('graphql');

const users = JSON.parse(fs.readFileSync('./json/users.json'));
const posts = JSON.parse(fs.readFileSync('./json/posts.json'));

const userType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLInt
        },
        name: { type: GraphQLString
        },
        username: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
    }
})

const postType = new GraphQLObjectType({
    name: 'Post',
    fields: {
        user: {
            type: userType,
            resolve: (source, params) => {
                return users.find(obj => {
                    return obj.id === source.userId
                })
            }
        },
        id: {
            type: GraphQLInt
        },
        title: {
            type: GraphQLString
        },
        body: {
            type: GraphQLString
        },
    }
})

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        post: {
            type: postType,
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (source, { id }) => {
                return posts.find(obj => {
                    return obj.id === id
                })
            }
        },
        posts: {
            type: new GraphQLList(postType),
            resolve: () => {
                return posts
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: queryType
})

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');