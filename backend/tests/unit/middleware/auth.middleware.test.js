const jwt = require("jsonwebtoken");
const authMiddleware = require("../../../src/middleware/auth.middleware");
const AppError = require("../../../src/errors/AppError");

const SECRET = process.env.JWT_SECRET;

describe("auth middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { cookies: {} };
    res = {};
    next = jest.fn();
  });

  it("calls next(AppError 401) when no cookie is present", () => {
    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(401);
    expect(next.mock.calls[0][0].message).toBe("Unauthorized");
  });

  it("calls next(AppError 401) for an invalid token", () => {
    req.cookies.token = "invalid.token.value";

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(401);
    expect(next.mock.calls[0][0].message).toBe("Invalid token");
  });

  it("attaches decoded payload to req.admin and calls next() on valid token", () => {
    const payload = { id: "abc123", role: "admin" };
    const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });
    req.cookies.token = token;

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.admin.id).toBe(payload.id);
    expect(req.admin.role).toBe(payload.role);
  });

  it("calls next(AppError 401) for an expired token", () => {
    const token = jwt.sign({ id: "abc" }, SECRET, { expiresIn: "-1s" });
    req.cookies.token = token;

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });
});
