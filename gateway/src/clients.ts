import { loadPackageDefinition, credentials } from 'grpc';
import * as protoLoader from '@grpc/proto-loader';
import { promisifyAll } from 'bluebird';

const ORDERS_PROTO_PATH = `${__dirname}/../../proto/orders.proto`;
const PRODUCTS_PROTO_PATH = `${__dirname}/../../proto/products.proto`;

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
  'localhost:50052',
  credentials.createInsecure(),
);
const productsStub = new products.products(
  'localhost:50051',
  credentials.createInsecure(),
);

const ordersGrpcClient: any = promisifyAll(ordersStub);
const productsGrpcClient: any = promisifyAll(productsStub);

export { ordersGrpcClient, productsGrpcClient };
