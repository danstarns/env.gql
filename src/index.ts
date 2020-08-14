import { mapSchema } from "@graphql-tools/utils";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { parseTypeDefs, stripEnv, castEnv } from "./util";
import { print, graphqlSync, InputObjectTypeDefinitionNode } from "graphql";

type MapSchema = typeof mapSchema;

interface Options {
  typeDefs: string;
  schemaTransforms: MapSchema[];
  override: { [k: string]: any };
}

function envGQL<C = Options["override"]>(options: Options): C {
  if (!options.typeDefs) {
    throw new Error("typeDefs required");
  }

  if (typeof options.typeDefs !== "string") {
    throw new TypeError("typeDefs must be a string");
  }

  if (options.schemaTransforms) {
    if (!Array.isArray(options.schemaTransforms)) {
      throw new TypeError("schemaTransforms must be a array");
    }
  } else {
    options.schemaTransforms = [];
  }

  const documentNode = parseTypeDefs(options.typeDefs);

  const configInput = documentNode.definitions.find(
    (x) => x.kind === "InputObjectTypeDefinition" && x.name.value === "Config"
  ) as InputObjectTypeDefinitionNode;

  if (!configInput) {
    throw new Error("typeDefs input Config {} required");
  }

  const queryMutateSub = documentNode.definitions.filter(
    (x) =>
      x.kind === "ObjectTypeDefinition" &&
      ["Query", "Mutation", "Subscription"].includes(x.name.value)
  );

  if (queryMutateSub.length) {
    throw new Error("Query, Mutation & Subscription not supported");
  }

  const fakeTypeDefs = `
    ${print(documentNode)}

    type Query {
      validate(Config: Config!): Boolean
    }
  `;

  const fakeSchema = makeExecutableSchema({
    typeDefs: fakeTypeDefs,
    resolvers: {
      Query: {
        validate: () => {
          // FAKE
        },
      },
    },
    schemaTransforms: options.schemaTransforms,
  });

  let newEnv = {};
  if (!options.override) {
    newEnv = castEnv(configInput);
  }

  const { errors } = graphqlSync({
    schema: fakeSchema,
    source: `
      query($Config: Config!){
        validate(Config: $Config)
      }
    `,
    variableValues: {
      Config: options.override
        ? options.override
        : stripEnv(configInput, newEnv),
    },
  });

  if (errors) {
    throw new Error(errors[0].message);
  }

  return (options.override ? options.override : newEnv) as C;
}

export = envGQL;
