import { InputObjectTypeDefinitionNode } from "graphql";

type Env = { [k: string]: any };

function castEnv(configInput: InputObjectTypeDefinitionNode): Env {
  const gqlEnvs = configInput.fields.map((field) => {
    const x = field as any;

    return {
      name: field.name.value,
      type: x.type.type.name.value,
      required: x.type.kind === "NonNullType",
    };
  });

  const casted = gqlEnvs.reduce((res: any, x: any) => {
    if (!process.env[x.name] && x.required) {
      throw new Error(`process.env.${x.name} required`);
    }

    switch (x.type) {
      case "Boolean":
        res[x.name] = JSON.parse(process.env[x.name]);
        break;

      case "Int":
        res[x.name] = Number(process.env[x.name]);
        break;

      default:
        res[x.name] = process.env[x.name];
    }

    return res;
  }, {});

  return casted;
}

export default castEnv;
