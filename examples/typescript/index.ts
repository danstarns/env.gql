/* eslint-disable @typescript-eslint/no-var-requires */
import envGQL from "../../dist";

const typeDefs = `
  input Config {
    PORT: Int
    URL: String
    SECRET: String
  }
`;

interface Config {
  PORT: number;
  URL: string;
  SECRET: string;
}

const config = envGQL<Config>({
  typeDefs,
});

console.log(config);
