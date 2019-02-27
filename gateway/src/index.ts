import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { getLogger } from 'log4js';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { exampleQueries } from './queries';
import * as playground from 'graphql-playground-middleware-express';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';

const logger = getLogger('index');
logger.level = 'debug';

const PORT = 4000;
const GRAPHQL_PATH = '/graphql';
const PLAYGROUND_PATH = '/playground';
const app = express();

app.get(
  `${PLAYGROUND_PATH}`,
  playground.default({
    endpoint: `${GRAPHQL_PATH}`,
    tabs: exampleQueries(GRAPHQL_PATH),
  }),
);

app.use('/voyager', voyagerMiddleware({ endpointUrl: `${GRAPHQL_PATH}` }));

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: `${GRAPHQL_PATH}` });

app.listen({ port: PORT }, () => {
  logger.info(
    `
    🚀
    Server ready at http://localhost:${PORT}${server.graphqlPath}
    Access playground with query examples at http://localhost:${PORT}${PLAYGROUND_PATH}
    🤘
    `,
  );
});
