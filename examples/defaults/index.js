/* eslint-disable @typescript-eslint/no-var-requires */
const envGQL = require("../../dist");

const typeDefs = `
  input Config {
    PORT: Int! = 123
    URL: String! = "url"
    SECRET: String! = "url"
    DEV: Boolean! = false
  }
`;

const config = envGQL({
  typeDefs: typeDefs,
});

console.log(config);
