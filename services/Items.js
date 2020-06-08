import spkg from 'apollo-server';
import fed from '@apollo/federation';
import { items } from '../source/mock.js';

const port = 4002;
const { ApolloServer, gql } = spkg;
const { buildFederatedSchema } = fed;

const typeDefs = gql`

    input ItemInput {
        sku: String!
        name: String!
        brand: String!
    }

    type Item @key(fields: "sku") @key(fields: "name") @key(fields: "brand") {
        sku: String!
        name: String!
        brand: String!
    }

    extend type Query {
        item(sku: String): Item
        allItems: [Item]
    }

    extend type Mutation {
        createItem(input: ItemInput): Item
    }
`;

const resolvers = {
    Item: {
        __resolveReference(obj) {
            console.log('item resolve reference')
            console.log(obj);
            return items.find(item => (item.sku === obj.sku));
        }
    },
    Query: {
        allItems: () => items,
        item: (_, { sku }, __, ___) => items.find(item => (item.sku === sku))
    }
}

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }])
})

server.listen({ port }).then(({ url }) => {
    console.log(`Items service running at ${url}`);
})