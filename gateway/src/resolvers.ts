import { getLogger } from 'log4js';
import { loadPackageDefinition, credentials } from 'grpc';
import * as protoLoader from '@grpc/proto-loader';
import { promisifyAll } from 'bluebird';

const PROTO_PATH = `${__dirname}/../../products/products/proto/products.proto`;

const logger = getLogger('resolvers');
logger.level = 'debug';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const products: any = loadPackageDefinition(packageDefinition).products;

const stub = new products.products(
  'localhost:50051',
  credentials.createInsecure(),
);

const client: any = promisifyAll(stub);

const resolvers = {
  Query: {
    hello: async () => {
      try {
        const response = await client.get_productAsync({ id: 'foo' });
        return response.title;
      } catch (error) {
        logger.error(error);
      }
    },
  },
};

export { resolvers };
