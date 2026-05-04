const bcrypt = require("bcrypt");
const request = require("supertest");
const Admin = require("../../../src/models/admin.model");
const app = require("../../../src/app");

const ADMIN = {
  name: "Test Admin",
  email: "admin@integration.test",
  password: "password123",
  role: "admin",
};

async function getAuthCookie() {
  const hashed = await bcrypt.hash(ADMIN.password, 10);
  await Admin.create({ ...ADMIN, password: hashed });

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: ADMIN.email, password: ADMIN.password });

  return res.headers["set-cookie"];
}

module.exports = { getAuthCookie, ADMIN };
