# env.gql
![Node.js CI](https://github.com/danstarns/env.gql/workflows/Node.js%20CI/badge.svg?branch=master&event=push) [![npm version](https://badge.fury.io/js/env.gql.svg)](https://www.npmjs.com/package/env.gql) [![TypeScript Compatible](https://img.shields.io/npm/types/scrub-js.svg)](https://github.com/danstarns/env.gql)

Use GraphQL Type Definitions To Validate process.env

```bash
$ npm i env.gql
```

[Examples](https://github.com/danstarns/env.gql/tree/master/examples)

> This library does not modify process.env directly. 

# Motivation
Fed up of not knowing what config to pass to a server? Use GraphQL to explain and validate your environment variables. Never see `cannot connect to 'undefined'` again 🎉

## Inspiration 
1. [GraphQL](https://www.npmjs.com/package/graphql)
2. [dotenv](https://www.npmjs.com/package/dotenv)
3. [env-var](https://www.npmjs.com/package/env-var)

# Example

> process.env.PORT will be casted to a number, process.env.DEV will be casted to a boolean. 

```js
const envGQL = require("env.gql");

const typeDefs = `
    input Config {
        PORT: Number!
        URL: String!
        SECRET: String!
        DEV: Boolean!
    }
`;

const config = envGQL({ typeDefs });
```

# Using .gql file
> The idiomatic file convention is `.env.gql`

```js
const path = require("path");
const envGQL = require("env.gql");

const typeDefsPath = path.join(__dirname, "./.env.gql");
const config = envGQL({ typeDefs: typeDefsPath });
```

# Using directives
> Using [graphql-constraint-directive](https://www.npmjs.com/package/graphql-constraint-directive)

```js
const envGQL = require("env.gql");
const { constraintDirective, constraintDirectiveTypeDefs } = require('graphql-constraint-directive')

const typeDefs = `
    input Config {
        PORT: Number 
        URL: String @constraint(format: "uri")
        SECRET: String 
    }

    ${constraintDirectiveTypeDefs}
`;

const config = envGQL({ 
    typeDefs,
    schemaTransforms: [constraintDirective()]
});
```

# Override
> Use to validate not just process.env

```js
const envGQL = require("env.gql");

const typeDefs = `
    input Config {
        PORT: Number
        URL: String
        SECRET: String
    }
`;

const config = envGQL({ 
    typeDefs,
    override: {
        PORT: 4000, 
        URL: "http://github.com",
        SECRET: "supersecret"
    }
});
```

# graphql-tag
```js
const envGQL = require("env.gql");
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
```

# TypeScript
```ts
import envGQL from "env.gql";

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
```

# Defaults
```js
const typeDefs = `
  input Config {
    PORT: Int = 123
    URL: String = "http://github.com"
    SECRET: String = "supersecret"
    DEV: Boolean = false
  }
`;

const config = envGQL({
  typeDefs: typeDefs,
});

typeof config.PORT === "number"
typeof config.URL === "string"
typeof config.SECRET === "string"
typeof config.DEV === "boolean"
```

# Required
> Use GraphQL `!` symbol

```js
const typeDefs = `
  input Config {
    PORT: Int! # Required
    URL: String
    SECRET: String
    DEV: Boolean
  }
`;

const config = envGQL({
  typeDefs: typeDefs,
});
```