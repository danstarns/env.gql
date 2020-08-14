# env.gql
Use GraphQL Type Definitions To Validate process.env

```bash
$ npm i env-gql
```

> Work in progress 🚧

# Example

```js
const envGql = require("env-gql");

const typeDefs = `
    input Config {
        PORT: Number
        URL: String
        SECRET: String
    }
`;

const config = envGql({ typeDefs });
```

# Using .gql files
```js
const path = require("path");
const envGql = require("env-gql");

const typeDefsPath = path.join(__dirname, "./Config.gql");
const config = envGql({ typeDefs: typeDefsPath });
```

# Using directives
> Using [graphql-constraint-directive](https://www.npmjs.com/package/graphql-constraint-directive)

```js
const envGql = require("env-gql");
const { constraintDirective, constraintDirectiveTypeDefs } = require('graphql-constraint-directive')

const typeDefs = `
    input Config {
        PORT: Number 
        URL: String @constraint(format: "uri")
        SECRET: String 
    }

    ${constraintDirectiveTypeDefs}
`;

const config = envGql({ 
    typeDefs,
    schemaTransforms: [constraintDirective()]
});
```

# Override
```js
const envGql = require("env-gql");

const typeDefs = `
    input Config {
        PORT: Number
        URL: String
        SECRET: String
    }
`;

const config = envGql({ 
    typeDefs,
    override: {
        PORT: 4000, 
        URL: "http://github.com",
        SECRET: "supersecret"
    }
});
```