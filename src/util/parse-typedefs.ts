import fs from "fs";
import { DocumentNode, parse, print } from "graphql";

type TypeDefsUnion = string | DocumentNode;

function parseTypeDefs(typeDefs: TypeDefsUnion): DocumentNode {
  if (typeof typeDefs === "string") {
    if (!fs.existsSync(typeDefs)) {
      try {
        return parse(typeDefs);
      } catch (error) {
        throw new Error(`cannot parse typeDefs: '${error}'.`);
      }
    } else {
      return parse(fs.readFileSync(typeDefs, "utf8"));
    }
  } else if (typeof typeDefs === "object") {
    if (Object.keys(typeDefs).includes("kind")) {
      return parse(print(typeDefs));
    }

    throw new Error("cannot parse typeDefs");
  } else {
    throw new Error("cannot parse typeDefs");
  }
}

export default parseTypeDefs;
