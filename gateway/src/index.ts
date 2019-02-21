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
    endpoint: '/playground',
    subscriptionEndpoint: '/',
  },
});

server.listen().then(({ url }) => {
  logger.info(`🚀 Server ready at ${url}`);
});
