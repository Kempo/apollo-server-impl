const { ApolloServer, gql } = require('apollo-server');

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

const allPeople = [
    {
        id: 1,
        name: 'Bill Gates',
        network: [2, 4]
    },
    {
        id: 2,
        name: 'Tom Hanks',
        network: [3]
    },
    {
        id: 3,
        name: 'Will Brazil',
        network: [4]

    },
    {
        id: 4,
        name: 'Josh Luber',
        network: [1, 2, 3]
    }
]

const allPurchases = []

const resolvers = {
    Query: {
        allPeople: () => allPeople,
        allPurchases: () => allPurchases,
        person: (_, { id }, __, ___) => staticPeople.find(person => (person.id === id))
    },
    Mutation: {
        makePurchase: (_, { person, item }, __, ___) => {
            allPurchases.push({
                date: "Today",
                buyer: {
                    id: person.id,
                    name: person.name,
                    network: [],
                    purchases: []
                },
                item
            })
            return allPurchases;
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`Apollo Server running at ${url}`);
})