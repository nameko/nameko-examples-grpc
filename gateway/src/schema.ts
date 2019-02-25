import { gql } from 'apollo-server';

const typeDefs = gql`
  type Product {
    id: ID!
    title: String!
    passengerCapacity: Int!
    maximumSpeed: Int!
    inStock: Int!
  }

  type OrderDetail {
    id: ID!
    product: Product!
    price: String!
    quantity: Int!
  }

  type Order {
    id: ID!
    orderDetails: [OrderDetail]!
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
    order(id: ID!): Order
    orders: [Order]
  }

  input ProductInput {
    id: ID!
    title: String
    passengerCapacity: Int
    maximumSpeed: Int
    inStock: Int
  }

  input OrderDetailsInput {
    productId: String!
    price: String!
    quantity: Int!
  }

  input OrderInput {
    orderDetails: [OrderDetailsInput]!
  }

  type Mutation {
    createProduct(input: ProductInput!): Product!
    createOrder(input: OrderInput!): Order!
  }
`;

export { typeDefs };
