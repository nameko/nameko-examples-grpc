const productQueries = `mutation CreateProduct {
  createProduct(
    input: {
      id:"the_odyssey",
      title: "The Odyssey",
      passengerCapacity: 123,
      maximumSpeed:9,
      inStock: 100
    }
  ) {
    id
    title
    passengerCapacity
    maximumSpeed
    inStock
  }
}

query GetProduct {
  product(id: "the_odyssey") {
    id
    title
    passengerCapacity
    maximumSpeed
    inStock
  }
}`;

const orderQueries = `mutation CreateOrder {
  createOrder(
    input: {
      orderDetails: {
        productId: "the_odyssey",
        price: "105.99",
        quantity: 123
      }
    }
  ) {
    id
    orderDetails {
      id
      product {
        id
        title
        passengerCapacity
        maximumSpeed
        inStock
      }
      price
      quantity
    }
  }
}

query GetOrder {
  order(id: 1) {
    id
    orderDetails {
      id
      product {
        id
        title
        passengerCapacity
        maximumSpeed
        inStock
      }
      price
      quantity
    }
  }
}
`;

const exampleQueries = graphqlPath => {
  return [
    {
      endpoint: `${graphqlPath}`,
      name: 'Products',
      query: productQueries,
    },
    {
      endpoint: `${graphqlPath}`,
      name: 'Orders',
      query: orderQueries,
    },
  ];
};

export { exampleQueries };
