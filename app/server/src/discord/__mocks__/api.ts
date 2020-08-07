jest.mock("../auth/login");
jest.mock("../auth/logout");
jest.mock("../user/getUser");

module.exports = jest.requireActual("../api");
