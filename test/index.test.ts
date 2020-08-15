/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expect } from "chai";
import { describe } from "mocha";
import envGQL from "../src";
import gql from "graphql-tag";
import path from "path";
import fs from "fs";
import {
  constraintDirective,
  constraintDirectiveTypeDefs,
} from "graphql-constraint-directive";

describe("envGQL", () => {
  describe("validation", () => {
    it("should be a function", () => {
      expect(envGQL).to.be.a("function");
    });

    it("should throw typeDefs required", () => {
      try {
        // @ts-ignore
        envGQL();

        throw new Error("I should not throw");
      } catch (error) {
        expect(error.message).to.equal("typeDefs required");
      }
    });

    it("should throw cannot parse typeDefs", () => {
      [{ bad: "bad" }, "invalid SDL"].forEach((bad) => {
        try {
          envGQL({
            // @ts-ignore
            typeDefs: bad,
          });

          throw new Error("I should not throw");
        } catch (error) {
          expect(error.message).to.include("cannot parse typeDefs");
        }
      });
    });

    it("should throw schemaTransforms must be an array", () => {
      try {
        envGQL({
          typeDefs: `
          input Config {
            PORT: String
          }
          `,
          // @ts-ignore
          schemaTransforms: {},
        });

        throw new Error("I should not throw");
      } catch (error) {
        expect(error.message).to.equal("schemaTransforms must be a array");
      }
    });

    it("should throw typeDefs input Config {} required", () => {
      try {
        envGQL({
          typeDefs: `
          input NotConfig {
            PORT: String
          }
          `,
        });

        throw new Error("I should not throw");
      } catch (error) {
        expect(error.message).to.equal("typeDefs input Config {} required");
      }
    });

    it("should throw Query, Mutation & Subscription not supported", () => {
      ["Query", "Mutation", "Subscription"].forEach((type) => {
        try {
          envGQL({
            typeDefs: `
              input Config {
                PORT: String
              }

              type ${type} {
                abc: Config
              }
            `,
          });

          throw new Error("I should not throw");
        } catch (error) {
          expect(error.message).to.equal(
            "Query, Mutation & Subscription not supported"
          );
        }
      });
    });
  });

  describe("functionally", () => {
    describe("simple", () => {
      it("should work with process.env", () => {
        process.env.PORT = "4000";
        process.env.URL = "http://github.com";
        process.env.SECRET = "supersecret";
        process.env.DEV = "false";

        const typeDefs = `
          input Config {
            PORT: Int
            URL: String
            SECRET: String
            DEV: Boolean
          }
        `;

        const config = envGQL({
          typeDefs: typeDefs,
        });

        expect(config).to.deep.equal({
          PORT: 4000,
          URL: "http://github.com",
          SECRET: "supersecret",
          DEV: false,
        });

        delete process.env.PORT;
        delete process.env.URL;
        delete process.env.SECRET;
        delete process.env.DEV;
      });

      it("should throw PORT required", () => {
        process.env.URL = "http://github.com";
        process.env.SECRET = "supersecret";
        process.env.DEV = "false";

        const typeDefs = `
          input Config {
            PORT: Int!
            URL: String
            SECRET: String
            DEV: Boolean
          }
        `;

        try {
          envGQL({
            typeDefs,
          });

          throw new Error("I should not throw");
        } catch (error) {
          expect(error.message).to.include("env.PORT required");
        }

        delete process.env.URL;
        delete process.env.SECRET;
        delete process.env.DEV;
      });

      it("should work with override", () => {
        const typeDefs = `
          input Config {
            PORT: Int
            URL: String
            SECRET: String
            DEV: Boolean
          }
        `;

        const config = envGQL({
          typeDefs: typeDefs,
          override: {
            PORT: "4000",
            URL: "http://github.com",
            SECRET: "supersecret",
            DEV: "false",
          },
        });

        expect(config).to.deep.equal({
          PORT: 4000,
          URL: "http://github.com",
          SECRET: "supersecret",
          DEV: false,
        });
      });
    });

    describe("defaults", () => {
      it("should assign correct defaults", () => {
        const typeDefs = `
          input Config {
            PORT: Int = 4000
            URL: String = "http://github.com"
            SECRET: String = "supersecret"
            DEV: Boolean = false
          }
      `;

        const config = envGQL({
          typeDefs: typeDefs,
        });

        expect(config).to.deep.equal({
          PORT: 4000,
          URL: "http://github.com",
          SECRET: "supersecret",
          DEV: false,
        });
      });
    });

    describe("graphql-tag", () => {
      it("should work with graphql-tag", () => {
        const typeDefs = gql`
          input Config {
            PORT: Int = 4000
            URL: String = "http://github.com"
            SECRET: String = "supersecret"
            DEV: Boolean = false
          }
        `;

        const config = envGQL({
          typeDefs: typeDefs,
        });

        expect(config).to.deep.equal({
          PORT: 4000,
          URL: "http://github.com",
          SECRET: "supersecret",
          DEV: false,
        });
      });
    });

    describe(".gql file", () => {
      it("should work with .gql file", () => {
        process.env.PORT = "4000";
        process.env.URL = "http://github.com";
        process.env.SECRET = "supersecret";
        process.env.DEV = "false";

        const config = envGQL({
          typeDefs: path.join(__dirname, "./.env.gql"),
        });

        expect(config).to.deep.equal({
          PORT: 4000,
          URL: "http://github.com",
          SECRET: "supersecret",
          DEV: false,
        });

        delete process.env.PORT;
        delete process.env.URL;
        delete process.env.SECRET;
        delete process.env.DEV;
      });
    });

    describe("directives", () => {
      it("should work with correct directives", () => {
        process.env.PORT = "4000";
        process.env.URL = "http://github.com";
        process.env.SECRET = "supersecret";
        process.env.DEV = "false";

        const typeDefs = `
          input Config {
            PORT: Int = 4000 @constraint(minLength: 4)
            URL: String = "http://github.com" @constraint(format: "uri")
            SECRET: String = "supersecret" @constraint(minLength: 5)
            DEV: Boolean = false
          }

          ${constraintDirectiveTypeDefs}
        `;

        const config = envGQL({
          typeDefs,
          schemaTransforms: [constraintDirective()],
        });

        expect(config).to.deep.equal({
          PORT: 4000,
          URL: "http://github.com",
          SECRET: "supersecret",
          DEV: false,
        });

        delete process.env.PORT;
        delete process.env.URL;
        delete process.env.SECRET;
        delete process.env.DEV;
      });

      it("should catch and throw a directive error", () => {
        process.env.PORT = "4000";
        process.env.URL = "not url";
        process.env.SECRET = "supersecret";
        process.env.DEV = "false";

        const typeDefs = `
          input Config {
            PORT: Int = 4000 @constraint(minLength: 4)
            URL: String = "http://github.com" @constraint(format: "uri")
            SECRET: String = "supersecret" @constraint(minLength: 5)
            DEV: Boolean = false
          }

          ${constraintDirectiveTypeDefs}
        `;

        try {
          envGQL({
            typeDefs,
            schemaTransforms: [constraintDirective()],
          });

          throw new Error("I should not throw");
        } catch (error) {
          expect(error.message).to.include(
            'Expected type "URL_String_format_uri"'
          );
        }

        delete process.env.PORT;
        delete process.env.URL;
        delete process.env.SECRET;
        delete process.env.DEV;
      });
    });
  });
});
