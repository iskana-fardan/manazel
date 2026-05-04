const request = require("supertest");
const app = require("../../src/app");
const { Field } = require("../../src/models/field.model");
const { connect, disconnect, clearCollections } = require("./setup/db");
const { getAuthCookie } = require("./setup/auth");

beforeAll(connect);
afterAll(disconnect);
afterEach(clearCollections);

const validField = {
  slug: "fiqh",
  name: "Fiqh",
  nameArabic: "الفقه",
  description: "Islamic jurisprudence",
  icon: "book",
  order: 1,
};

// ── GET /api/fields ──────────────────────────────────────────────────────────

describe("GET /api/fields", () => {
  it("returns 200 with an empty array when no fields exist", async () => {
    const res = await request(app).get("/api/fields");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns all fields sorted by order ascending", async () => {
    await Field.create({ ...validField, slug: "aqidah", name: "Aqidah", order: 2 });
    await Field.create(validField);

    const res = await request(app).get("/api/fields");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].order).toBe(1);
    expect(res.body[1].order).toBe(2);
  });
});

// ── POST /api/fields ─────────────────────────────────────────────────────────

describe("POST /api/fields", () => {
  it("returns 401 without an auth cookie", async () => {
    const res = await request(app).post("/api/fields").send(validField);

    expect(res.status).toBe(401);
  });

  it("returns 400 when required fields are missing", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/api/fields")
      .set("Cookie", cookie)
      .send({ name: "Fiqh" });

    expect(res.status).toBe(400);
  });

  it("returns 400 when slug already exists", async () => {
    const cookie = await getAuthCookie();
    await Field.create(validField);

    const res = await request(app)
      .post("/api/fields")
      .set("Cookie", cookie)
      .send(validField);

    expect(res.status).toBe(400);
    expect(res.text).toMatch(/already exists/i);
  });

  it("creates the field and returns it with a 200", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/api/fields")
      .set("Cookie", cookie)
      .send(validField);

    expect(res.status).toBe(200);
    expect(res.body._id).toBeDefined();
    expect(res.body.slug).toBe(validField.slug);
    expect(res.body.order).toBe(validField.order);
  });

  it("stores the slug in lowercase regardless of input casing", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/api/fields")
      .set("Cookie", cookie)
      .send({ ...validField, slug: "FIQH" });

    expect(res.status).toBe(200);
    expect(res.body.slug).toBe("fiqh");
  });
});

// ── PUT /api/fields/:id ──────────────────────────────────────────────────────

describe("PUT /api/fields/:id", () => {
  it("returns 401 without an auth cookie", async () => {
    const field = await Field.create(validField);
    const res = await request(app).put(`/api/fields/${field._id}`).send(validField);

    expect(res.status).toBe(401);
  });

  it("returns 400 for a malformed ObjectId", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .put("/api/fields/not-an-id")
      .set("Cookie", cookie)
      .send(validField);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid ID");
  });

  it("returns 404 when the field does not exist", async () => {
    const cookie = await getAuthCookie();
    const fakeId = "000000000000000000000000";
    const res = await request(app)
      .put(`/api/fields/${fakeId}`)
      .set("Cookie", cookie)
      .send(validField);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Field not found");
  });

  it("returns 400 when the new slug is taken by another field", async () => {
    const cookie = await getAuthCookie();
    const f1 = await Field.create(validField);
    await Field.create({ ...validField, slug: "tafsir", name: "Tafsir", order: 2 });

    const res = await request(app)
      .put(`/api/fields/${f1._id}`)
      .set("Cookie", cookie)
      .send({ ...validField, slug: "tafsir" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/slug already exists/i);
  });

  it("updates and returns the modified field", async () => {
    const cookie = await getAuthCookie();
    const field = await Field.create(validField);

    const res = await request(app)
      .put(`/api/fields/${field._id}`)
      .set("Cookie", cookie)
      .send({ ...validField, name: "Fiqh Updated" });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Fiqh Updated");
  });

  it("allows updating a field's own slug without triggering duplicate error", async () => {
    const cookie = await getAuthCookie();
    const field = await Field.create(validField);

    const res = await request(app)
      .put(`/api/fields/${field._id}`)
      .set("Cookie", cookie)
      .send({ ...validField, slug: "fiqh" });

    expect(res.status).toBe(200);
  });
});

// ── DELETE /api/fields/:id ───────────────────────────────────────────────────

describe("DELETE /api/fields/:id", () => {
  it("returns 401 without an auth cookie", async () => {
    const field = await Field.create(validField);
    const res = await request(app).delete(`/api/fields/${field._id}`);

    expect(res.status).toBe(401);
  });

  it("returns 400 for a malformed ObjectId", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .delete("/api/fields/not-an-id")
      .set("Cookie", cookie);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid ID");
  });

  it("returns 404 when the field does not exist", async () => {
    const cookie = await getAuthCookie();
    const fakeId = "000000000000000000000000";
    const res = await request(app)
      .delete(`/api/fields/${fakeId}`)
      .set("Cookie", cookie);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Field not found");
  });

  it("deletes the field and returns a success message", async () => {
    const cookie = await getAuthCookie();
    const field = await Field.create(validField);

    const res = await request(app)
      .delete(`/api/fields/${field._id}`)
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Field deleted");

    const found = await Field.findById(field._id);
    expect(found).toBeNull();
  });
});
