import spkg from 'apollo-server';
import fed from '@apollo/federation';
import crypto from 'crypto';
import { purchases, people, items } from '../source/mock.js';

const port = 4003;
const { ApolloServer, gql } = spkg;
const { buildFederatedSchema } = fed;

const typeDefs = gql`

    type Purchase {
        id: ID!
        date: String!
        item: Item! @provides(fields: "sku name brand")
        buyer: Person! @provides(fields: "id name network")
        shipped: Boolean
    }

    extend type Person @key(fields: "id") @key(fields: "name") @key(fields: "network") {
        id: ID! @external # comes from external service ie. Persons
        name: String! @external 
        network: [ID] @external
        recentPurchases: [Purchase]
    }

    extend type Item @key(fields: "sku") @key(fields: "name") @key(fields: "brand") {
        sku: String! @external
        name: String! @external
        brand: String! @external
    }

    extend type Query {
        purchase(id: String): Purchase
        allPurchases: [Purchase]
    }

    extend type Mutation {
        makePurchase(buyer: ID, sku: ID): String,
        finalizePurchase(id: String): String
    }
`;

const resolvers = {
    Person: {
        recentPurchases: ({ id }) => purchases.filter(pr => (pr.buyer.id === id))
    },
    Query: {
        purchase: (_, { id }, __, ___) => purchases.find(p => (p.id === id)),
        allPurchases: () => purchases
    },
    Mutation: {
        makePurchase: (_, { buyer, sku }, __, ___) => {
            const pseudoID = crypto.randomBytes(10).toString('hex');
            
            purchases.push({
                id: pseudoID,
                date: (new Date().toISOString()),
                buyer: people.find(p => (p.id === buyer)),
                item: items.find(i => (i.sku === sku)),
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