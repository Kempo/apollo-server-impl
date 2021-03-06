import spkg from 'apollo-server';
import fed from '@apollo/federation';
import { people } from '../source/mock.js';

const port = 4001;
const { ApolloServer, gql } = spkg;
const { buildFederatedSchema } = fed;

const typeDefs = gql`
    type Person @key(fields: "id") {
        id: ID!
        name: String
        network: [Person]
    }

    extend type Query {
        allPeople: [Person]
        person(id: ID): Person # the type for person ID
    }
`;

const resolvers = {
    Person: {
        __resolveReference(obj) {
            console.log('person resolver');
            console.log(obj);
            return people.find(person => (person.id === obj.id));
        }
    },
    Query: {
        allPeople: () => people,
        person: (_, { id }, __, ___) => people.find(person => (person.id === id)),
    }
}

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }])
})

server.listen({ port }).then(({ url }) => {
    console.log(`Person service running at ${url}`);
})