import spkg from 'apollo-server';
import gpkg from '@apollo/gateway';

const port = 4000;
const { ApolloServer } = spkg;
const { ApolloGateway } = gpkg;

const gateway = new ApolloGateway({
    serviceList: [
        { name: 'persons', url: 'http://localhost:4001' },
        { name: 'items', url: 'http://localhost:4002' },
        { name: 'purchases', url: 'http://localhost:4003' },
        { name: 'network', url: 'http://localhost:4004' }
    ]
})

/**
 * TODO: error handling, federation
 * services: 
 * - person
 * - item
 * - fulfillment (purchase)
 */
/*
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
        makePurchase(buyer: Int, item: ItemInput): String,
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
                date: (new Date().toISOString()),
                buyer: people.find(person => (person.id === buyer)), // way to make query here?
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
*/

const server = new ApolloServer({
    gateway,
    subscriptions: false
})

server.listen({ port }).then(({ url }) => {
    console.log(`Apollo Server running at ${url}`);
})