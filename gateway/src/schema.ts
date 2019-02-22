import { gql } from 'apollo-server';

const typeDefs = gql`
  type Product {
    id: ID!
    title: String
    passengerCapacity: Int
    maximumSpeed: Int
    inStock: Int
  }

  input ProductInput {
    id: ID!
    title: String
    passengerCapacity: Int
    maximumSpeed: Int
    inStock: Int
  }

  type Query {
    products: [Product]!
    product(id: ID!): Product
  }

  type Mutation {
    createProduct(input: ProductInput!): Product!
  }
`;

export { typeDefs };
