/* eslint-disable @typescript-eslint/no-var-requires */
const envGQL = require("../../dist");
const gql = require("graphql-tag");

const typeDefs = gql`
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
