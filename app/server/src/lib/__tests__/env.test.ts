import { env } from "../env";

describe("env", () => {
  beforeEach(() => {
    process.env.TEST_VALUE = "X";
  });

  afterEach(() => {
    delete process.env.TEST_VALUE;
  });

  it("proxies process.env, converting camel-case keys to upper-snake case", () => {
    expect(env.testValue).toEqual("X");
  });

  it("proxies process.env via conventional keys", () => {
    expect(env.TEST_VALUE).toEqual("X");
  });

  it("throws an error if a value does not exist", () => {
    expect(() => env.doesNotExist).toThrowError(
      "Environment variable DOES_NOT_EXIST is not defined"
    );
  });
});
