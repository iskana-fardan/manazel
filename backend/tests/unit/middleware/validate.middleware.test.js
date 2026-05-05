const { z } = require("zod");
const validate = require("../../../src/middleware/validate.middleware");
const AppError = require("../../../src/errors/AppError");

const schema = z.object({
  name: z.string().min(3),
  age: z.number().int(),
});

describe("validate middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {};
    next = jest.fn();
  });

  it("calls next() without error when body matches schema", () => {
    req.body = { name: "Ahmad", age: 30 };

    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({ name: "Ahmad", age: 30 });
  });

  it("replaces req.body with the parsed/coerced value", () => {
    req.body = { name: "Ahmad", age: 30, extra: "stripped" };

    validate(schema)(req, res, next);

    expect(req.body.extra).toBeUndefined();
  });

  it("calls next(AppError) with 400 when body is invalid", () => {
    req.body = { name: "AB", age: 30 };

    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(400);
    expect(err.message).toMatch(/name/i);
  });

  it("includes field path in the error message", () => {
    req.body = { name: "AB" };

    validate(schema)(req, res, next);

    const err = next.mock.calls[0][0];
    expect(err.message).toMatch(/name/i);
  });
});
