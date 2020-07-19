import { envCase } from "../envCase";

describe("envCase", () => {
  it("converts camelCase to ENVIRONMENT_VARIABLE_CASE", () => {
    expect(envCase("environmentVariableCase")).toEqual(
      "ENVIRONMENT_VARIABLE_CASE"
    );
  });
});
