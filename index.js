import pkg from 'apollo-server';
import { people, purchases } from './source/mock.js';
import crypto from 'crypto';

const { ApolloServer, gql } = pkg;
/**
 * TODO: error handling, federation
 * services: 
 * - person
 * - item
 * - fulfillment (purchase)
 */
const typeDefs = gql`

    input ItemInput {
        name: String!
        brand: String
    }

    type Person {
        id: ID!
        name: String!
        network: [ID]
        # purchases keep track
    }

    type Item {
        name: String!
        brand: String
    }

    type Purchase {
        id: ID!
        date: String!
        item: Item!
        buyer: Person
        shipped: Boolean
    }

    type Query {
        allPeople: [Person]
        allPurchases: [Purchase]
        person(id: Int): Person # the type for person ID
        purchase(id: String): Purchase # the type for purchase ID 
    }

    type Mutation {
        makePurchase(buyer: ID, item: ItemInput): String,
        finalizePurchase(id: String): String
    }
`;

const resolvers = {
    Query: {
        allPeople: () => people,
        allPurchases: () => purchases,
        person: (_, { id }, __, ___) => people.find(person => (person.id === id)),
        purchase: (_, { id }, __, ___) => purchases.find(purchase => (purchase.id === id))
    },
    Mutation: {
        makePurchase: (_, { buyer, item }, __, ___) => {
            const pseudoID = crypto.randomBytes(10).toString('hex');
            purchases.push({
                id: pseudoID,
                date: "Today",
                buyer: people[buyer - 1], // way to make query here?
                item,
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

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`Apollo Server running at ${url}`);
})