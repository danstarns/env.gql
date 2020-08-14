# env.gql
Use GraphQL Type Definitions To Validate process.env

```bash
$ npm i env-gql
```

# Motivation
Fed up of not knowing what config to pass to a server? Use GraphQL to explain and validate your environment variables. Never see `cannot connect to 'undefined'` again 🎉

## Inspiration 
1. [GraphQL](https://www.npmjs.com/package/graphql)
2. [env-var](https://www.npmjs.com/package/env-var)

# Example

```js
const envGQL = require("env-gql");

const typeDefs = `
    input Config {
        PORT: Number
        URL: String
        SECRET: String
    }
`;

const config = envGQL({ typeDefs });
```

# Using .gql files
```js
const path = require("path");
const envGQL = require("env-gql");

const typeDefsPath = path.join(__dirname, "./Config.gql");
const config = envGQL({ typeDefs: typeDefsPath });
```

# Using directives
> Using [graphql-constraint-directive](https://www.npmjs.com/package/graphql-constraint-directive)

```js
const envGQL = require("env-gql");
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
```js
const envGQL = require("env-gql");

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