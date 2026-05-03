jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../../src/models/admin.model");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../../../src/models/admin.model");
const { login, logout, me } = require("../../../src/controllers/auth.controller");

describe("auth.controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, admin: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn(),
    };
    process.env.JWT_SECRET = "testsecret";
    process.env.NODE_ENV = "test";
  });

  // ── login ────────────────────────────────────────────────────────────────

  describe("login", () => {
    it("returns 400 when admin is not found", async () => {
      req.body = { email: "ghost@test.com", password: "pass" };
      Admin.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });

    it("returns 400 when password does not match", async () => {
      req.body = { email: "admin@test.com", password: "wrong" };
      Admin.findOne.mockResolvedValue({ email: "admin@test.com", password: "hashed" });
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });

    it("returns 500 when an unexpected error is thrown", async () => {
      req.body = { email: "admin@test.com", password: "pass" };
      Admin.findOne.mockRejectedValue(new Error("db error"));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });

    it("sets httpOnly cookie and returns admin data on success", async () => {
      const mockAdmin = {
        _id: "adminId123",
        name: "Admin User",
        email: "admin@test.com",
        role: "admin",
        password: "hashed",
      };
      req.body = { email: "admin@test.com", password: "correct" };
      Admin.findOne.mockResolvedValue(mockAdmin);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("signedtoken");

      await login(req, res);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockAdmin._id, role: mockAdmin.role },
        "testsecret",
        { expiresIn: "1d" }
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "token",
        "signedtoken",
        expect.objectContaining({ httpOnly: true, sameSite: "strict" })
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        admin: {
          id: mockAdmin._id,
          name: mockAdmin.name,
          email: mockAdmin.email,
          role: mockAdmin.role,
        },
      });
    });

    it("sets secure: false when NODE_ENV is not production", async () => {
      process.env.NODE_ENV = "test";
      const mockAdmin = { _id: "id", name: "A", email: "a@b.com", role: "admin", password: "h" };
      req.body = { email: "a@b.com", password: "pass" };
      Admin.findOne.mockResolvedValue(mockAdmin);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token");

      await login(req, res);

      expect(res.cookie).toHaveBeenCalledWith(
        "token",
        "token",
        expect.objectContaining({ secure: false })
      );
    });

    it("sets secure: true when NODE_ENV is production", async () => {
      process.env.NODE_ENV = "production";
      const mockAdmin = { _id: "id", name: "A", email: "a@b.com", role: "admin", password: "h" };
      req.body = { email: "a@b.com", password: "pass" };
      Admin.findOne.mockResolvedValue(mockAdmin);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token");

      await login(req, res);

      expect(res.cookie).toHaveBeenCalledWith(
        "token",
        "token",
        expect.objectContaining({ secure: true })
      );
    });
  });

  // ── logout ───────────────────────────────────────────────────────────────

  describe("logout", () => {
    it("clears the token cookie and returns a success message", () => {
      logout(req, res);
      expect(res.clearCookie).toHaveBeenCalledWith("token");
      expect(res.json).toHaveBeenCalledWith({ message: "Logged out successfully" });
    });
  });

  // ── me ───────────────────────────────────────────────────────────────────

  describe("me", () => {
    it("returns the admin document without the password field", async () => {
      const mockAdmin = { _id: "adminId", name: "Admin", email: "a@b.com", role: "admin" };
      req.admin = { id: "adminId" };
      const selectMock = jest.fn().mockResolvedValue(mockAdmin);
      Admin.findById.mockReturnValue({ select: selectMock });

      await me(req, res);

      expect(Admin.findById).toHaveBeenCalledWith("adminId");
      expect(selectMock).toHaveBeenCalledWith("-password");
      expect(res.json).toHaveBeenCalledWith(mockAdmin);
    });
  });
});
