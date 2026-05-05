jest.mock("../../../src/startup/logging", () => ({
  error: jest.fn(),
  warn: jest.fn(),
  child: jest.fn().mockReturnThis(),
}));

const errorMiddleware = require("../../../src/middleware/error.middleware");
const AppError = require("../../../src/errors/AppError");

describe("error middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("returns 500 with generic message for unknown errors", () => {
    const err = new Error("db failure");
    errorMiddleware(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error" });
  });

  it("returns the AppError statusCode and message for operational errors", () => {
    const err = new AppError("Not found", 404);
    errorMiddleware(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Not found" });
  });

  it("returns 400 for Mongoose CastError", () => {
    const err = Object.assign(new Error("Cast error"), { name: "CastError", path: "_id", value: "bad" });
    errorMiddleware(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Invalid ID" });
  });

  it("returns 400 for Mongoose ValidationError with joined messages", () => {
    const err = Object.assign(new Error("Validation failed"), {
      name: "ValidationError",
      errors: {
        name: { message: "name is required" },
        email: { message: "email is invalid" },
      },
    });
    errorMiddleware(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].message).toMatch(/name is required/);
  });

  it("returns 400 for MongoDB duplicate key error (code 11000)", () => {
    const err = Object.assign(new Error("Duplicate"), { code: 11000, keyValue: { email: "x" } });
    errorMiddleware(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].message).toMatch(/email/);
  });

  it("uses req.log child logger when available", () => {
    const appErr = new AppError("Forbidden", 403);
    const mockLog = { warn: jest.fn(), error: jest.fn() };
    req.log = mockLog;
    errorMiddleware(appErr, req, res, next);
    expect(mockLog.warn).toHaveBeenCalled();
  });
});
