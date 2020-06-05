import spkg from 'apollo-server';
import fed from '@apollo/federation';
import { items } from '../source/mock.js';

const port = 4002;
const { ApolloServer, gql } = spkg;
const { buildFederatedSchema } = fed;

const typeDefs = gql`

    type Item @key(fields: "sku") @key(fields: "name") @key(fields: "brand") {
        sku: String!
        name: String!
        brand: String!
    }

    extend type Query {
        item(sku: String): Item
        allItems: [Item]
    }
`;

const resolvers = {
    Query: {
        allItems: () => items,
        item: (_, { sku }, __, ___) => items.find(item => (item.sku === sku)),
    }
}

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }])
})

server.listen({ port }).then(({ url }) => {
    console.log(`Item service running at ${url}`);
})