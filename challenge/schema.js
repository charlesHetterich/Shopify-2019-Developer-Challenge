const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLSchema,
    GraphQLList,
    GraphQLFloat,
    GraphQLNonNull
} = require('graphql');

const backend = require('./backend.js');

//Message Type
const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
        message: {type: GraphQLString}
    })
});

//Customer Type
const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: () => ({
        title: {type: GraphQLString},
        price: {type: GraphQLFloat},
        inventory_count: {type: GraphQLInt}
    })
});

//Shopping Cart Type
const ShoppingCartType = new GraphQLObjectType({
    name: 'Shopping_Cart',
    fields: () => ({
        cartContents: {type: new GraphQLList(ProductType)}
    })
});

//RecieptType
const RecieptType = new GraphQLObjectType({
    name: 'Reciept',
    fields: () => ({
        cart: {type: ShoppingCartType},
        total: {type: GraphQLFloat}
    })
});

//Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        product: {
            type: ProductType,
            args: {
                title: { type: GraphQLString },
            },
            resolve(parentValue, args) {
                return backend.product(args.title);
            }
        },
        products: {
            type: new GraphQLList(ProductType),
            args: {
                title: { type: GraphQLString },
            },
            resolve(parentValue, args) {
                return backend.products(args.title);
            }
        },
        updateProductCount: {
            type: ProductType,
            args: {
                title: { type: GraphQLString },
                count: { type: GraphQLInt }
            },
            resolve(parentValue, args) {
                return backend.updateProductCount(args.title, args.count);
            }
        },
        browse: {
            type: new GraphQLList(ProductType),
            args: {
                title: { type: GraphQLString },
            },
            resolve(parentValue, args) {
                return backend.products(args.title, true);
            }
        },
        addToCart: {
            type: MessageType,
            args: {
                title: { type: GraphQLString },
            },
            resolve(parentValue, args) {
                return backend.addToCart(args.title);
            }
        },
        reciept: {
            type: RecieptType,
            resolve(parentValue, args) {
                return backend.reciept();
            }
        },
        checkOut: {
            type: RecieptType,
            resolve(parentValue, args) {
                return backend.checkOut();
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});