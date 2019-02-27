import { getLogger } from 'log4js';
import { ordersGrpcClient, productsGrpcClient } from './clients';

const logger = getLogger('resolvers');
logger.level = 'debug';

const resolvers = {
  Query: {
    product: async (_, { id }) => {
      const response = await productsGrpcClient.getProductAsync({ id });
      return response;
    },
    products: async () => {
      const response = await productsGrpcClient.listProductsAsync({});
      return response.products;
    },
    order: async (_, { id }) => {
      const response = await ordersGrpcClient.getOrderAsync({ id });
      return response;
    },
  },
  OrderDetail: {
    product: async parent => {
      const response = await productsGrpcClient.getProductAsync({
        id: parent.productId,
      });
      return response;
    },
  },
  Mutation: {
    createProduct: async (_, { input }) => {
      const response = await productsGrpcClient.createProductAsync({
        ...input,
      });
      return response;
    },
    createOrder: async (_, { input }) => {
      const response = await ordersGrpcClient.createOrderAsync({
        ...input,
      });
      return response;
    },
  },
};

export { resolvers };
