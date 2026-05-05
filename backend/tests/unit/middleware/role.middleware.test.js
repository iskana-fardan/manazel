const requireRole = require("../../../src/middleware/role.middleware");
const AppError = require("../../../src/errors/AppError");

describe("requireRole middleware", () => {
  let res, next;

  beforeEach(() => {
    res = {};
    next = jest.fn();
  });

  it("calls next() when the admin role is in the allowed list", () => {
    const req = { admin: { role: "admin" } };
    requireRole("admin", "superadmin")(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it("calls next() for superadmin role", () => {
    const req = { admin: { role: "superadmin" } };
    requireRole("superadmin")(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it("calls next(AppError 403) when the admin role is not in the allowed list", () => {
    const req = { admin: { role: "admin" } };
    requireRole("superadmin")(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(403);
  });

  it("calls next(AppError 403) when req.admin is missing", () => {
    const req = {};
    requireRole("admin")(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(403);
  });

  it("calls next(AppError 403) when no roles are specified", () => {
    const req = { admin: { role: "admin" } };
    requireRole()(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });
});
