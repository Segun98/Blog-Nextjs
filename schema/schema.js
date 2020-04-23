const graphql = require('graphql')
// const {
//     posts,
//     users
// } = require('./dummydb')
const Posts = require('../models/posts')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull
} = graphql



const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        title: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        date: {
            type: GraphQLString
        },
        category: {
            type: GraphQLString
        },
        author: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        }

    })
});

// const UsersType = new GraphQLObjectType({
//     name: 'Users',
//     fields: () => ({
//         id: {
//             type: GraphQLID
//         },
//         email: {
//             type: GraphQLString
//         },
//         fullname: {
//             type: GraphQLString
//         },
//         password: {
//             type: GraphQLString
//         },
//         posts: {
//             type: new GraphQLList(PostType),
//             resolve(parent, args) {
//                 return posts.filter(post => post.email === parent.email)
//             }
//         }
//     })
// });


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        post: {
            type: PostType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return Posts.findById(args.id)
                // return posts.find(post => post.id === args.id)
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve() {
                return Posts.find()
                // return posts
            }
        }
        // user: {
        //     type: UsersType,
        //     args: {
        //         email: {
        //             type: GraphQLString
        //         }
        //     },
        //     resolve(parent, args) {
        //         return users.find(user => user.email === args.email)
        //     }
        // },
        // users: {
        //     type: new GraphQLList(UsersType),
        //     resolve() {
        //         return users
        //     }
        // },

    }

})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addPost: {
            type: PostType,
            args: {
                title: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                description: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                date: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                category: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                author: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                email: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve(parent, args){

                let post = new Posts({
                    title: args.title,
                    description: args.description,
                    date: args.date,
                    category: args.category,
                    author: args.author,
                    email: args.email
                });
                return post.save()
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})