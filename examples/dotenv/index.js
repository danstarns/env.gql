/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
const envGQL = require("../../dist");
const path = require("path");
const fs = require("fs");
require('dotenv').config({ path: path.join(__dirname, "./.env") })

const typeDefs = fs.readFileSync(path.join(__dirname, "./.env.gql"), "utf-8");

const config = envGQL({
  typeDefs,
});

console.log(config);
