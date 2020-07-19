import { makeSchema } from "../index";

describe("GraphQL Schema", () => {
  it("can be used to start an Apollo server without errors", () => {
    expect(makeSchema).not.toThrow();
  });
});
