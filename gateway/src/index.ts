import { ApolloServer } from 'apollo-server';
import { getLogger } from 'log4js';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const logger = getLogger('index');
logger.level = 'debug';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: '/',
    subscriptionEndpoint: '/',
    tabs: [
      {
        endpoint: '/',
        // @ts-ignore
        name: 'GetProduct',
        query: `query GetProduct {
            product(id: "the_odyssey") {
              id
              title
              passengerCapacity
              maximumSpeed
              inStock
            }
          }`,
      },
      {
        endpoint: '/',
        // @ts-ignore
        name: 'CreateProduct',
        query: `query CreateProduct {
            product(id: "the_odyssey") {
              id
              title
              passengerCapacity
              maximumSpeed
              inStock
            }
          }`,
      },
    ],
  },
});

server.listen().then(({ url }) => {
  logger.info(
    `
    🚀
    Server ready at ${url}
    Access playground with query examples at ${url}playground
    🤘
    `,
  );
});
