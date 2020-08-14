/* eslint-disable @typescript-eslint/no-var-requires */
const envGQL = require("../../dist");

const typeDefs = `
  input Config {
    PORT: Int
    URL: String
    SECRET: String
  }
`;

const config = envGQL({
  typeDefs: typeDefs,
});

console.log(config);
