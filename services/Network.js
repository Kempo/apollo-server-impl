import spkg from 'apollo-server';
import fed from '@apollo/federation';

const port = 4004;
const { ApolloServer, gql } = spkg;
const { buildFederatedSchema } = fed;

/**
 * 
 */
const typeDefs = gql`
    extend type Person @key(fields: "id") {
        id: ID! @external
        network: [Person]
    }
`;

const resolvers = {
    Person: {
        network: (obj) => {
            console.log(obj);
            return { __typename: "Person", id: obj.id };
        }
    }
}

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }])
})

server.listen({ port }).then(({ url }) => {
    console.log(`Network service running at ${url}`);
})