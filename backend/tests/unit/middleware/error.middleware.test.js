jest.mock("../../../src/startup/logging", () => ({ error: jest.fn() }));

const logger = require("../../../src/startup/logging");
const errorMiddleware = require("../../../src/middleware/error.middleware");

describe("errorMiddleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  it("logs the error message and stack", () => {
    const err = new Error("something broke");
    errorMiddleware(err, req, res, next);
    expect(logger.error).toHaveBeenCalledWith(err.message, { stack: err.stack });
  });

  it("responds with status 500 and a generic message", () => {
    const err = new Error("db failure");
    errorMiddleware(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Internal server error");
  });

  it("does not call next", () => {
    const err = new Error("any error");
    errorMiddleware(err, req, res, next);
    expect(next).not.toHaveBeenCalled();
  });
});
