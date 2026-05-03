jest.mock("jsonwebtoken");

const jwt = require("jsonwebtoken");
const authMiddleware = require("../../../src/middleware/auth.middleware");

describe("authMiddleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { cookies: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    process.env.JWT_SECRET = "testsecret";
  });

  it("returns 401 when no token cookie is present", () => {
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when token is invalid or expired", () => {
    req.cookies.token = "badtoken";
    jwt.verify.mockImplementation(() => {
      throw new Error("jwt malformed");
    });
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("attaches decoded payload to req.admin and calls next on valid token", () => {
    req.cookies.token = "validtoken";
    const payload = { id: "adminId", role: "admin" };
    jwt.verify.mockReturnValue(payload);

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("validtoken", "testsecret");
    expect(req.admin).toEqual(payload);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
