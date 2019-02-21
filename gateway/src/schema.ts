import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    hello: Product
    products: [Product]!
    product(id: ID!): Product
  }

  type Product {
    id: ID!
    title: String
    passengerCapacity: Int
    maximumSpeed: Int
    inStock: Int
  }
`;

export { typeDefs };
