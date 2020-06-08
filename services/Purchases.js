import spkg from 'apollo-server';
import fed from '@apollo/federation';
import crypto from 'crypto';
import { purchases } from '../source/mock.js';

const port = 4003;
const { ApolloServer, gql } = spkg;
const { buildFederatedSchema } = fed;

const typeDefs = gql`

    type Purchase {
        id: ID!
        date: String
        item: Item
        buyer: Person
        shipped: Boolean
    }

    extend type Person @key(fields: "id") {
        id: ID! @external # comes from external service ie. Persons
        purchases: [Purchase]
    }

    extend type Item @key(fields: "sku") {
        sku: String! @external
        name: String! @external
    }

    extend type Query {
        purchase(id: String): Purchase
        allPurchases: [Purchase]
    }

    extend type Mutation {
        makePurchase(id: ID, sku: ID): String,
        finalizePurchase(id: String): String
    }
`;

const resolvers = {
    Person: {
        purchases: ({ id }) => purchases.filter(pr => (pr.buyer.id === id))
    },
    Query: {
        purchase: (_, { id }, __, ___) => purchases.find(p => (p.id === id)),
        allPurchases: () => purchases
    },
    Mutation: {
        makePurchase: (_, { id, sku }, __, ___) => {
            const pseudoID = crypto.randomBytes(10).toString('hex');
            purchases.push({
                id: pseudoID,
                date: (new Date().toISOString()),
                buyer: { id }, // change to buyer id. DOuble check this reasoning!
                item: { sku }, // change to item id 
                shipped: false
            })

            return `Purchase created! id: ${pseudoID}`;
        },
        finalizePurchase: (_, { id }, __, ___) => {
            purchases.find(purchase => (purchase.id === id)).shipped = true;
            return `Purchase shipped! id: ${id}`;
        }
    }
}

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }])
})

server.listen({ port }).then(({ url }) => {
    console.log(`Purchase service running at ${url}`);
})