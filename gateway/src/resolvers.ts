import { getLogger } from 'log4js';
import { credentials } from 'grpc';
import { promisifyAll } from 'bluebird';

const messages = require('./proto/products_pb');
const services = require('./proto/products_grpc_pb');

const logger = getLogger('resolvers');
logger.level = 'debug';

const stub = new services.productsClient(
  'localhost:50051',
  credentials.createInsecure(),
);

const client: any = promisifyAll(stub);
const request = new messages.GetProduct();

const resolvers = {
  Query: {
    hello: async () => {
      request.setId('foo');
      try {
        const response = await client.get_productAsync(request);
        return response.getTitle();
      } catch (error) {
        logger.error(error);
      }
    },
  },
};

export { resolvers };
