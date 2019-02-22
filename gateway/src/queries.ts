const exampleQueries = graphqlPath => {
  return [
    {
      endpoint: `${graphqlPath}`,
      name: 'CreateProduct',
      query: `mutation Create {
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
      }`,
    },
    {
      endpoint: `${graphqlPath}`,
      name: 'GetProduct',
      query: `query GetProduct {
        product(id: "the_odyssey") {
          id
          title
          passengerCapacity
          maximumSpeed
          inStock
        }
      }`,
    },
  ];
};

export { exampleQueries };
