const request = require("supertest");
const app = require("../../src/app");
const { Field } = require("../../src/models/field.model");
const { Book } = require("../../src/models/book.model");
const { Roadmap } = require("../../src/models/roadmap.model");
const { connect, disconnect, clearCollections } = require("./setup/db");

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

const validBook = {
  title: "Al-Muwatta",
  author: "Imam Malik",
  titleArabic: "الموطأ",
};

// ── GET /api/roadmaps ────────────────────────────────────────────────────────

describe("GET /api/roadmaps", () => {
  it("returns 200 with an empty array when no roadmaps exist", async () => {
    const res = await request(app).get("/api/roadmaps");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns all roadmaps", async () => {
    const field = await Field.create(validField);
    await Roadmap.create({ field: field._id, title: field.name, levels: [], muthalaah: [] });

    const res = await request(app).get("/api/roadmaps");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

// ── GET /api/roadmaps/:fieldSlug ─────────────────────────────────────────────

describe("GET /api/roadmaps/:fieldSlug", () => {
  it("returns 404 when the field slug does not exist", async () => {
    const res = await request(app).get("/api/roadmaps/nonexistent-slug");

    expect(res.status).toBe(404);
  });

  it("returns 404 when the field exists but has no roadmap", async () => {
    await Field.create(validField);

    const res = await request(app).get("/api/roadmaps/fiqh");

    expect(res.status).toBe(404);
  });

  it("returns the roadmap for a valid field slug", async () => {
    const field = await Field.create(validField);
    await Roadmap.create({ field: field._id, title: field.name, levels: [], muthalaah: [] });

    const res = await request(app).get("/api/roadmaps/fiqh");

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(validField.name);
  });
});

// ── POST /api/roadmaps/:fieldSlug ────────────────────────────────────────────

describe("POST /api/roadmaps/:fieldSlug", () => {
  it("returns 404 when the field slug does not exist", async () => {
    const res = await request(app).post("/api/roadmaps/nonexistent-slug");

    expect(res.status).toBe(404);
    expect(res.text).toMatch(/field not found/i);
  });

  it("returns 400 when a roadmap already exists for the field", async () => {
    const field = await Field.create(validField);
    await Roadmap.create({ field: field._id, title: field.name, levels: [], muthalaah: [] });

    const res = await request(app).post("/api/roadmaps/fiqh");

    expect(res.status).toBe(400);
    expect(res.text).toMatch(/already exists/i);
  });

  it("creates a roadmap with three default levels in each section", async () => {
    await Field.create(validField);

    const res = await request(app).post("/api/roadmaps/fiqh");

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(validField.name);
    expect(res.body.levels).toHaveLength(3);
    expect(res.body.muthalaah).toHaveLength(3);
  });

  it("populates levels with the correct slugs in order", async () => {
    await Field.create(validField);

    const res = await request(app).post("/api/roadmaps/fiqh");

    const levelSlugs = res.body.levels.map((l) => l.slug);
    expect(levelSlugs).toEqual(["beginner", "intermediate", "advanced"]);

    const muthalaahSlugs = res.body.muthalaah.map((l) => l.slug);
    expect(muthalaahSlugs).toEqual(["beginner", "intermediate", "advanced"]);
  });

  it("initialises each level with an empty books array", async () => {
    await Field.create(validField);

    const res = await request(app).post("/api/roadmaps/fiqh");

    res.body.levels.forEach((level) => expect(level.books).toEqual([]));
    res.body.muthalaah.forEach((level) => expect(level.books).toEqual([]));
  });
});

// ── POST /api/roadmaps/:fieldSlug/:section/:levelSlug/books ──────────────────

describe("POST /api/roadmaps/:fieldSlug/:section/:levelSlug/books", () => {
  let book;

  beforeEach(async () => {
    await Field.create(validField);
    await request(app).post("/api/roadmaps/fiqh");
    book = await Book.create(validBook);
  });

  it("returns 404 when the field slug does not resolve to a roadmap", async () => {
    const res = await request(app)
      .post("/api/roadmaps/nonexistent/dars/beginner/books")
      .send({ bookId: book._id.toString() });

    expect(res.status).toBe(404);
  });

  it("returns 404 for an invalid level slug", async () => {
    const res = await request(app)
      .post("/api/roadmaps/fiqh/dars/invalid-level/books")
      .send({ bookId: book._id.toString() });

    expect(res.status).toBe(404);
    expect(res.text).toMatch(/level not found/i);
  });

  it("returns 400 when the book is already in the level", async () => {
    await request(app)
      .post("/api/roadmaps/fiqh/dars/beginner/books")
      .send({ bookId: book._id.toString() });

    const res = await request(app)
      .post("/api/roadmaps/fiqh/dars/beginner/books")
      .send({ bookId: book._id.toString() });

    expect(res.status).toBe(400);
    expect(res.text).toMatch(/already in this level/i);
  });

  it("adds a book to the dars section and returns the updated roadmap", async () => {
    const res = await request(app)
      .post("/api/roadmaps/fiqh/dars/beginner/books")
      .send({ bookId: book._id.toString() });

    expect(res.status).toBe(200);
    const beginnerLevel = res.body.levels.find((l) => l.slug === "beginner");
    expect(beginnerLevel.books).toContain(book._id.toString());
  });

  it("adds a book to the muthalaah section and returns the updated roadmap", async () => {
    const res = await request(app)
      .post("/api/roadmaps/fiqh/muthalaah/intermediate/books")
      .send({ bookId: book._id.toString() });

    expect(res.status).toBe(200);
    const intermediateLevel = res.body.muthalaah.find((l) => l.slug === "intermediate");
    expect(intermediateLevel.books).toContain(book._id.toString());
  });

  it("does not add the book to the wrong section", async () => {
    const res = await request(app)
      .post("/api/roadmaps/fiqh/dars/beginner/books")
      .send({ bookId: book._id.toString() });

    expect(res.status).toBe(200);
    const beginnerMuthalaah = res.body.muthalaah.find((l) => l.slug === "beginner");
    expect(beginnerMuthalaah.books).toHaveLength(0);
  });
});

// ── DELETE /api/roadmaps/:fieldSlug/:section/:levelSlug/books/:bookId ────────

describe("DELETE /api/roadmaps/:fieldSlug/:section/:levelSlug/books/:bookId", () => {
  let book;

  beforeEach(async () => {
    await Field.create(validField);
    await request(app).post("/api/roadmaps/fiqh");
    book = await Book.create(validBook);
    await request(app)
      .post("/api/roadmaps/fiqh/dars/beginner/books")
      .send({ bookId: book._id.toString() });
  });

  it("returns 404 when the field slug does not resolve to a roadmap", async () => {
    const res = await request(app).delete(
      `/api/roadmaps/nonexistent/dars/beginner/books/${book._id}`,
    );

    expect(res.status).toBe(404);
  });

  it("returns 404 for an invalid level slug", async () => {
    const res = await request(app).delete(
      `/api/roadmaps/fiqh/dars/invalid-level/books/${book._id}`,
    );

    expect(res.status).toBe(404);
    expect(res.text).toMatch(/level not found/i);
  });

  it("removes the book and returns the updated roadmap", async () => {
    const res = await request(app).delete(
      `/api/roadmaps/fiqh/dars/beginner/books/${book._id}`,
    );

    expect(res.status).toBe(200);
    const beginnerLevel = res.body.levels.find((l) => l.slug === "beginner");
    expect(beginnerLevel.books).not.toContain(book._id.toString());
    expect(beginnerLevel.books).toHaveLength(0);
  });

  it("removing a non-existent book is idempotent and returns 200", async () => {
    const otherId = "000000000000000000000001";

    const res = await request(app).delete(
      `/api/roadmaps/fiqh/dars/beginner/books/${otherId}`,
    );

    // The controller filters the array and saves regardless — no 404 for unknown bookId
    expect(res.status).toBe(200);
    const beginnerLevel = res.body.levels.find((l) => l.slug === "beginner");
    expect(beginnerLevel.books).toContain(book._id.toString());
  });

  it("only removes the book from the targeted section and level", async () => {
    await request(app)
      .post("/api/roadmaps/fiqh/muthalaah/beginner/books")
      .send({ bookId: book._id.toString() });

    await request(app).delete(
      `/api/roadmaps/fiqh/dars/beginner/books/${book._id}`,
    );

    const roadmapRes = await request(app).get("/api/roadmaps/fiqh");
    const muthalaahBeginner = roadmapRes.body.muthalaah.find((l) => l.slug === "beginner");
    expect(muthalaahBeginner.books).toContain(book._id.toString());
  });
});
