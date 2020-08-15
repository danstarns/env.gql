/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expect } from "chai";
import { describe } from "mocha";
import envGQL from "../src";

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
});
