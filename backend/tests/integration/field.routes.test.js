const request = require("supertest");
const app = require("../../src/app");
const Field = require("../../src/models/field.model");
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
  it("returns 200 with empty data array when no fields exist", async () => {
    const res = await request(app).get("/api/fields");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
    expect(res.body.meta.count).toBe(0);
  });

  it("returns all fields sorted by order ascending", async () => {
    await Field.create({ ...validField, slug: "aqidah", name: "Aqidah", order: 2 });
    await Field.create(validField);

    const res = await request(app).get("/api/fields");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].order).toBe(1);
    expect(res.body.data[1].order).toBe(2);
    expect(res.body.meta.count).toBe(2);
  });
});

// ── POST /api/fields ─────────────────────────────────────────────────────────

describe("POST /api/fields", () => {
  it("returns 401 without an auth cookie", async () => {
    const res = await request(app).post("/api/fields").send(validField);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 when required fields are missing", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/api/fields")
      .set("Cookie", cookie)
      .send({ name: "Fiqh" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 when slug already exists", async () => {
    const cookie = await getAuthCookie();
    await Field.create(validField);

    const res = await request(app)
      .post("/api/fields")
      .set("Cookie", cookie)
      .send(validField);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it("creates the field and returns 201 with envelope", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/api/fields")
      .set("Cookie", cookie)
      .send(validField);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBeDefined();
    expect(res.body.data.slug).toBe(validField.slug);
    expect(res.body.data.order).toBe(validField.order);
  });

  it("stores the slug in lowercase regardless of input casing", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/api/fields")
      .set("Cookie", cookie)
      .send({ ...validField, slug: "FIQH" });

    expect(res.status).toBe(201);
    expect(res.body.data.slug).toBe("fiqh");
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
    const res = await request(app)
      .put("/api/fields/000000000000000000000000")
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
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Fiqh Updated");
  });

  it("allows updating a field using its own slug without triggering duplicate error", async () => {
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
    const res = await request(app)
      .delete("/api/fields/000000000000000000000000")
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
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Field deleted");
    expect(await Field.findById(field._id)).toBeNull();
  });
});
