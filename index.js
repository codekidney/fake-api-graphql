const fs              = require('fs');
const express         = require('express');
const graphqlHTTP     = require('express-graphql');
const { GraphQLSchema, GraphQLBoolean, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLFloat } = require('graphql');

const albums   = JSON.parse(fs.readFileSync('./json/albums.json'));
const comments = JSON.parse(fs.readFileSync('./json/comments.json'));
const photos   = JSON.parse(fs.readFileSync('./json/photos.json'));
const posts    = JSON.parse(fs.readFileSync('./json/posts.json'));
const todos    = JSON.parse(fs.readFileSync('./json/todos.json'));
const users    = JSON.parse(fs.readFileSync('./json/users.json'));

const geoType = new GraphQLObjectType({
    name: 'Geo',
    fields: {
        lat: { type: GraphQLFloat },
        lng: { type: GraphQLFloat },
    }
})

const companyType = new GraphQLObjectType({
    name: 'Company',
    fields: {
        name: { type: GraphQLString },
        catchPhrase: { type: GraphQLString },
        bs: { type: GraphQLString },
    }
})

const addressType = new GraphQLObjectType({
    name: 'Address',
    fields: {
        street: { type: GraphQLString },
        suite: { type: GraphQLString },
        city: { type: GraphQLString },
        zipcode: { type: GraphQLString },
        geo: {
            type: geoType
        },
    }
})

const userType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        address: { type: addressType },
        phone: { type: GraphQLString },
        website: { type: GraphQLString },
        company: { type: companyType },
    }
})

const postType = new GraphQLObjectType({
    name: 'Post',
    fields: {
        user: {
            type: userType,
            resolve: (source, params) => 
                users.find(obj => { return obj.id === source.userId 
            })
        },
        id: { type: GraphQLInt },
        title: { type: GraphQLString },
        body: { type: GraphQLString },
    }
})

const albumType = new GraphQLObjectType({
    name: 'Album',
    fields: {
        user: {
            type: userType,
            resolve: (source, params) => 
                users.find(obj => { return obj.id === source.userId 
            })
        },
        id: { type: GraphQLInt },
        title: { type: GraphQLString },
    }
})

const photoType = new GraphQLObjectType({
    name: 'Photo',
    fields: {
        album: {
            type: albumType,
            resolve: (source, params) => 
                users.find(obj => { return obj.id === source.albumId 
            })
        },
        id: { type: GraphQLInt },
        title: { type: GraphQLString },
        url: { type: GraphQLString },
        thumbnailUrl: { type: GraphQLString },
    }
})

const commentType = new GraphQLObjectType({
    name: 'Comment',
    fields: {
        post: {
            type: postType,
            resolve: (source, params) => 
                users.find(obj => { return obj.id === source.postId 
            })
        },
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        body: { type: GraphQLString },
    }
})

const todoType = new GraphQLObjectType({
    name: 'Todo',
    fields: {
        user: {
            type: userType,
            resolve: (source, params) => 
                users.find(obj => { return obj.id === source.userId 
            })
        },
        id: { type: GraphQLInt },
        title: { type: GraphQLString },
        completed: { type: GraphQLBoolean },
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
            resolve: (source, { id }) => 
                posts.find(obj => { return obj.id === id 
            })
        },
        posts: {
            type: new GraphQLList(postType),
            resolve: () => { return posts }
        },
        todos: {
            type: new GraphQLList(todoType),
            resolve: () => { return todos }
        },
        photos: {
            type: new GraphQLList(photoType),
            resolve: () => { return photos }
        },
        users: {
            type: new GraphQLList(userType),
            resolve: () => { return users }
        },
        albums: {
            type: new GraphQLList(albumType),
            resolve: () => { return albums }
        },
        comments: {
            type: new GraphQLList(commentType),
            resolve: () => { return comments }
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