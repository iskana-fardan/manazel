const AppError = require("../../../src/errors/AppError");

describe("AppError", () => {
  it("sets message and statusCode", () => {
    const err = new AppError("Not found", 404);
    expect(err.message).toBe("Not found");
    expect(err.statusCode).toBe(404);
  });

  it("defaults statusCode to 500", () => {
    const err = new AppError("Something broke");
    expect(err.statusCode).toBe(500);
  });

  it("sets isOperational to true", () => {
    const err = new AppError("Bad request", 400);
    expect(err.isOperational).toBe(true);
  });

  it("is an instance of Error", () => {
    const err = new AppError("test", 400);
    expect(err).toBeInstanceOf(Error);
  });

  it("captures a stack trace", () => {
    const err = new AppError("test", 400);
    expect(err.stack).toBeDefined();
  });
});
