const roleMiddleware = require("../../../src/middleware/role.middleware");

describe("roleMiddleware", () => {
  let req, res, next;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("calls next when the admin role is in the allowed list", () => {
    req = { admin: { role: "admin" } };
    roleMiddleware("admin", "superadmin")(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("calls next for superadmin role", () => {
    req = { admin: { role: "superadmin" } };
    roleMiddleware("superadmin")(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("returns 403 when the admin role is not in the allowed list", () => {
    req = { admin: { role: "admin" } };
    roleMiddleware("superadmin")(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when no roles are allowed", () => {
    req = { admin: { role: "admin" } };
    roleMiddleware()(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
