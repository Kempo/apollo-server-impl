import pkg from 'apollo-server';
import { people, purchases } from './source/mock.js';

const { ApolloServer, gql } = pkg;

const typeDefs = gql`

    input PersonInput {
        id: ID!
        name: String!
    }

    input ItemInput {
        name: String!
        brand: String!
    }

    type Person {
        id: ID!
        name: String!
        network: [ID]
        purchases: [Purchase]
    }

    type Item {
        name: String!
        brand: String!
    }

    type Purchase {
        date: Date
        item: Item
        buyer: Person
    }

    type Date {
        date: String
    }

    type Query {
        allPeople: [Person]
        person(id: ID): Person
        allPurchases: [Purchase]
    }

    type Mutation {
        makePurchase(person: PersonInput, item: ItemInput): [Purchase]
    }
`;

const resolvers = {
    Query: {
        allPeople: () => people,
        allPurchases: () => purchases,
        person: (_, { id }, __, ___) => staticPeople.find(person => (person.id === id))
    },
    Mutation: {
        makePurchase: (_, { person, item }, __, ___) => {
            purchases.push({
                date: "Today",
                buyer: {
                    id: person.id,
                    name: person.name,
                    network: [],
                    purchases: []
                },
                item
            })
            return purchases;
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`Apollo Server running at ${url}`);
})