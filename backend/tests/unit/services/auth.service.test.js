jest.mock("../../../src/repositories/admin.repository");
jest.mock("../../../src/config", () => ({
  jwt: { secret: "test-secret", expiresIn: "1d" },
  isProduction: false,
}));

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminRepo = require("../../../src/repositories/admin.repository");
const authService = require("../../../src/services/auth.service");
const AppError = require("../../../src/errors/AppError");

describe("auth.service", () => {
  describe("login", () => {
    it("throws AppError 400 when email is not found", async () => {
      adminRepo.findByEmail.mockResolvedValue(null);
      await expect(authService.login({ email: "x@x.com", password: "pw" }))
        .rejects.toMatchObject({ statusCode: 400, message: "Invalid credentials" });
    });

    it("throws AppError 400 when password does not match", async () => {
      const hashed = await bcrypt.hash("correctpw", 10);
      adminRepo.findByEmail.mockResolvedValue({ _id: "id1", password: hashed, role: "admin" });
      await expect(authService.login({ email: "x@x.com", password: "wrongpw" }))
        .rejects.toMatchObject({ statusCode: 400, message: "Invalid credentials" });
    });

    it("returns a token and admin payload on valid credentials", async () => {
      const password = "correct";
      const hashed = await bcrypt.hash(password, 10);
      const admin = { _id: "id1", name: "Admin", email: "a@a.com", role: "admin", password: hashed };
      adminRepo.findByEmail.mockResolvedValue(admin);

      const result = await authService.login({ email: admin.email, password });

      expect(result.token).toBeDefined();
      expect(result.admin).toMatchObject({ id: admin._id, name: admin.name, role: admin.role });
      expect(result.admin.password).toBeUndefined();
    });

    it("signs the JWT with the config secret", async () => {
      const password = "pw123";
      const hashed = await bcrypt.hash(password, 10);
      adminRepo.findByEmail.mockResolvedValue({ _id: "id1", name: "A", email: "a@a.com", role: "admin", password: hashed });

      const { token } = await authService.login({ email: "a@a.com", password });

      expect(() => jwt.verify(token, "test-secret")).not.toThrow();
    });
  });

  describe("getMe", () => {
    it("throws AppError 404 when admin is not found", async () => {
      adminRepo.findById.mockResolvedValue(null);
      await expect(authService.getMe("id1"))
        .rejects.toMatchObject({ statusCode: 404, message: "Admin not found" });
    });

    it("returns the admin document when found", async () => {
      const admin = { _id: "id1", name: "Admin", email: "a@a.com" };
      adminRepo.findById.mockResolvedValue(admin);
      const result = await authService.getMe("id1");
      expect(result).toBe(admin);
    });
  });
});
