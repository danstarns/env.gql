import { InputObjectTypeDefinitionNode } from "graphql";

type Env = { [k: string]: any };

function stripEnv(
  configInput: InputObjectTypeDefinitionNode,
  newEnv: Env
): Env {
  const gqlEnvs = configInput.fields.map((field) => field.name.value);

  return Object.entries(newEnv).reduce((res, [key, value]) => {
    if (gqlEnvs.includes(key)) {
      res[key] = value;
    }

    return res;
  }, {});
}

export default stripEnv;
