import { getLogger } from 'log4js';
import { ordersGrpcClient, productsGrpcClient } from './clients';

const logger = getLogger('resolvers');
logger.level = 'debug';

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
