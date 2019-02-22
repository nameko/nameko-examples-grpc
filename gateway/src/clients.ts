import { loadPackageDefinition, credentials } from 'grpc';
import * as protoLoader from '@grpc/proto-loader';
import { promisifyAll } from 'bluebird';

const ORDERS_PROTO_PATH = `${__dirname}/../../proto/orders.proto`;

const ordersPackageDefinition = protoLoader.loadSync(ORDERS_PROTO_PATH, {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const orders: any = loadPackageDefinition(ordersPackageDefinition).orders;

const ordersStub = new orders.orders(
  'localhost:50051',
  credentials.createInsecure(),
);

const ordersGrpcClient: any = promisifyAll(ordersStub);

export { ordersGrpcClient };
