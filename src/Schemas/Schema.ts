import { 
    GraphQLString, 
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
} from 'graphql';
import * as _ from 'lodash';
import * as axios from 'axios';

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    fields: () => ({
        postId: { type: GraphQLInt },
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        body: { type: GraphQLString },
        post: {
            type: PostType,
            async resolve(parent, args) {
                const { data } = await axios.default.get(`https://jsonplaceholder.typicode.com/posts/${parent.postId}`);
                return data;
            }
        }
    })
})

const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { type: GraphQLInt },
        title: { type: GraphQLString },
        body: { type: GraphQLString },
        userId: { type: GraphQLInt },
        user: {
            type: UserType,
            async resolve(parent, args) {
                const { data } = await axios.default.get(`https://jsonplaceholder.typicode.com/users/${parent.userId}`);
                return data;
            }
        },
        comments: {
            type: new GraphQLList(CommentType),
            async resolve(parent, args) {
                const { data } = await axios.default.get(`http://jsonplaceholder.typicode.com/comments?postId=${parent.id}`);
                return data;
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        website: { type: GraphQLString },
        address: { 
            type: new GraphQLObjectType({
                name: 'Address',
                fields: () => ({
                    street: { type: GraphQLString },
                    suite: { type: GraphQLString },
                    city: { type: GraphQLString },
                    zipcode: { type: GraphQLString },
                    geo: {
                        type: new GraphQLObjectType({
                            name: 'Geo',
                            fields: () => ({
                                lat: { type: GraphQLString },
                                lng: { type: GraphQLString }
                            })
                        })
                    }
                })
            })
        },
        company: {
            type: new GraphQLObjectType({
                name: 'Company',
                fields: () => ({
                    name: { type: GraphQLString },
                    catchPhrase: { type: GraphQLString },
                    bs: { type: GraphQLString },
                })
            })
        },
        posts: {
            type: new GraphQLList(PostType),
            async resolve(parent, args) {
                const { data } = await axios.default.get(`https://jsonplaceholder.typicode.com/posts?userId=${parent.id}`);
                return data;
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        post: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) }
            },
            async resolve(parent, args) {
                const { data } = await axios.default.get(`https://jsonplaceholder.typicode.com/posts/${args.id}`);
                return data;
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            async resolve(parent, args)  {
                const { data } = await axios.default.get('https://jsonplaceholder.typicode.com/posts');
                return data;
            }
        },
        user: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) }
            },
            async resolve(parent, args) {
                const { data } = await axios.default.get(`https://jsonplaceholder.typicode.com/users/${args.id}`);
                return data;
            }
        },
        users: {
            type: new GraphQLList(UserType),
            async resolve(parent, args) {
                const { data } = await axios.default.get(`https://jsonplaceholder.typicode.com/users`);
                return data;
            }
        },
        comment: {
            type: CommentType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) }
            },
            async resolve(parent, args) {
                const { data } = await axios.default.get(`http://jsonplaceholder.typicode.com/comments/${args.id}`);
                return data;
            }
        },
        comments: {
            type: new GraphQLList(CommentType),
            async resolve(parent, args) {
                const { data } = await axios.default.get(`http://jsonplaceholder.typicode.com/comments`);
                return data;
            }
        }
    }
});

export default new GraphQLSchema({
    query: RootQuery
});
