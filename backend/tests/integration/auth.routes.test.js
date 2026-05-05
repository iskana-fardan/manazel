const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../../src/app");
const Admin = require("../../src/models/admin.model");
const { connect, disconnect, clearCollections } = require("./setup/db");

beforeAll(connect);
afterAll(disconnect);
afterEach(clearCollections);

const adminCredentials = {
  name: "Test Admin",
  email: "admin@test.com",
  password: "password123",
  role: "admin",
};

async function seedAdmin() {
  const hashed = await bcrypt.hash(adminCredentials.password, 10);
  return Admin.create({ ...adminCredentials, password: hashed });
}

async function loginAndGetCookie() {
  await seedAdmin();
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: adminCredentials.email, password: adminCredentials.password });
  return res.headers["set-cookie"];
}

// ── POST /api/auth/login ─────────────────────────────────────────────────────

describe("POST /api/auth/login", () => {
  it("returns 400 when email is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "anypassword" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 when email is not registered", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "ghost@test.com", password: "anypassword" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("returns 400 when password is incorrect", async () => {
    await seedAdmin();

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: adminCredentials.email, password: "wrongpassword" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("returns 200 with admin payload in data envelope on valid credentials", async () => {
    await seedAdmin();

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: adminCredentials.email, password: adminCredentials.password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.data.admin).toMatchObject({
      email: adminCredentials.email,
      name: adminCredentials.name,
      role: adminCredentials.role,
    });
    expect(res.body.data.admin.password).toBeUndefined();
  });

  it("sets an httpOnly token cookie on success", async () => {
    await seedAdmin();

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: adminCredentials.email, password: adminCredentials.password });

    expect(res.status).toBe(200);
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    const tokenCookie = cookies.find((c) => c.startsWith("token="));
    expect(tokenCookie).toBeDefined();
    expect(tokenCookie).toMatch(/HttpOnly/i);
  });
});

// ── POST /api/auth/logout ────────────────────────────────────────────────────

describe("POST /api/auth/logout", () => {
  it("returns 200 and a success message", async () => {
    const res = await request(app).post("/api/auth/logout");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Logged out successfully");
  });

  it("clears the token cookie in the response", async () => {
    const cookie = await loginAndGetCookie();

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    const cookies = res.headers["set-cookie"] || [];
    const tokenCookie = cookies.find((c) => c.startsWith("token="));
    expect(tokenCookie).toMatch(/Expires=Thu, 01 Jan 1970/i);
  });
});

// ── GET /api/auth/me ─────────────────────────────────────────────────────────

describe("GET /api/auth/me", () => {
  it("returns 401 when no cookie is present", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  it("returns 401 for a tampered or invalid token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", ["token=this.is.not.a.valid.jwt"]);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid token");
  });

  it("returns the admin document without the password field", async () => {
    const cookie = await loginAndGetCookie();

    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(adminCredentials.email);
    expect(res.body.data.name).toBe(adminCredentials.name);
    expect(res.body.data.password).toBeUndefined();
  });
});
