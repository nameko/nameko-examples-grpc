import { loadPackageDefinition, credentials } from 'grpc';
import * as protoLoader from '@grpc/proto-loader';
import { promisifyAll } from 'bluebird';

const ORDERS_SERVICE = process.env.ORDERS_SERVICE || 'localhost:50052';
const PRODUCTS_SERVICE = process.env.PRODUCTS_SERVICE || 'localhost:50051';

const ORDERS_PROTO_PATH =
  process.env.ORDERS_PROTO_PATH || `${__dirname}/../../proto/orders.proto`;
const PRODUCTS_PROTO_PATH =
  process.env.PRODUCTS_PROTO_PATH || `${__dirname}/../../proto/products.proto`;

const ordersPackageDefinition = protoLoader.loadSync(ORDERS_PROTO_PATH, {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const productsPackageDefinition = protoLoader.loadSync(PRODUCTS_PROTO_PATH, {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const orders: any = loadPackageDefinition(ordersPackageDefinition).orders;
const products: any = loadPackageDefinition(productsPackageDefinition).products;

const ordersStub = new orders.orders(
  `${ORDERS_SERVICE}`,
  credentials.createInsecure(),
);
const productsStub = new products.products(
  `${PRODUCTS_SERVICE}`,
  credentials.createInsecure(),
);

const ordersGrpcClient: any = promisifyAll(ordersStub);
const productsGrpcClient: any = promisifyAll(productsStub);

export { ordersGrpcClient, productsGrpcClient };
