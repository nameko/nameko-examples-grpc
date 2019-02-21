const exampleQueries = graphqlPath => {
  return [
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
    {
      endpoint: `${graphqlPath}`,
      name: 'CreateProduct',
      query: `query CreateProduct {
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
