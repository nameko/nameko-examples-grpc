import { getLogger } from 'log4js';
import { loadPackageDefinition, credentials } from 'grpc';
import * as protoLoader from '@grpc/proto-loader';
import { promisifyAll } from 'bluebird';
import { ordersGrpcClient } from './clients';

const PRODUCTS_PROTO_PATH = `${__dirname}/../../products/products/proto/products.proto`;

const logger = getLogger('resolvers');
logger.level = 'debug';

const productsPackageDefinition = protoLoader.loadSync(PRODUCTS_PROTO_PATH, {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const products: any = loadPackageDefinition(productsPackageDefinition).products;

const productsStub = new products.products(
  'localhost:50051',
  credentials.createInsecure(),
);

const productsGrpcClient: any = promisifyAll(productsStub);

const resolvers = {
  Query: {
    product: async (_, { id }) => {
      try {
        const response = await productsGrpcClient.getProductAsync({ id });
        return response;
      } catch (error) {
        logger.error(error);
      }
    },
    products: async () => {
      try {
        const response = await productsGrpcClient.listProductsAsync({});
        logger.info(response.products);
        return response.products;
      } catch (error) {
        logger.error(error);
      }
    },
    order: async (_, { id }) => {
      try {
        const response = await ordersGrpcClient.getOrderAsync({ id });
        return response;
      } catch (error) {
        logger.error(error);
      }
    },
  },
  Mutation: {
    createProduct: async (_, { input }) => {
      try {
        const response = await productsGrpcClient.createProductAsync({
          ...input,
        });
        return response;
      } catch (error) {
        logger.error(error);
      }
    },
    createOrder: async (_, { input }) => {
      try {
        const response = await ordersGrpcClient.createOrderAsync({
          ...input,
        });
        return response;
      } catch (error) {
        logger.error(error);
      }
    },
  },
};

export { resolvers };
