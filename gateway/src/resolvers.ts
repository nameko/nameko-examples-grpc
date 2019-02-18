const resolvers = {
  Query: {
    hello: async () => {
      return 'World';
    },
  },
};

export { resolvers };
