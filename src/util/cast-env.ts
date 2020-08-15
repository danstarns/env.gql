import { InputObjectTypeDefinitionNode } from "graphql";

type Env = { [k: string]: any };

function castEnv(configInput: InputObjectTypeDefinitionNode, newEnv: Env): Env {
  const gqlEnvs = configInput.fields.map((field) => {
    const x = field as any;

    return {
      name: field.name.value,
      type: x.type?.type?.name?.value || x.type.name.value,
      required: x.type?.kind === "NonNullType",
      default: x.defaultValue?.value,
    };
  });

  const casted = gqlEnvs.reduce((res: any, env: any) => {
    if (!newEnv[env.name] && newEnv[env.name] !== false) {
      if (!env.default && env.default !== false && env.required) {
        throw new Error(`env.${env.name} required`);
      } else {
        newEnv[env.name] = env.default;
      }
    }

    switch (env.type) {
      case "Boolean":
        res[env.name] = JSON.parse(newEnv[env.name]);
        break;

      case "Int":
        res[env.name] = Number(newEnv[env.name]);
        break;

      default:
        res[env.name] = newEnv[env.name];
    }

    return res;
  }, {});

  return casted;
}

export default castEnv;
