const request = require("supertest");
const app = require("../../src/app");
const { Book } = require("../../src/models/book.model");
const { connect, disconnect, clearCollections } = require("./setup/db");

beforeAll(connect);
afterAll(disconnect);
afterEach(clearCollections);

const validBook = {
  title: "Fath al-Bari",
  titleArabic: "فتح الباري",
  author: "Ibn Hajar al-Asqalani",
  type: "sharh",
  level: "advanced",
  field: "hadith",
  description: "Commentary on Sahih al-Bukhari",
};

// ── GET /api/books ───────────────────────────────────────────────────────────

describe("GET /api/books", () => {
  it("returns 404 when the collection is empty", async () => {
    const res = await request(app).get("/api/books");

    expect(res.status).toBe(404);
    expect(res.text).toMatch(/no books found/i);
  });

  it("returns 200 with all books", async () => {
    await Book.create(validBook);
    await Book.create({ ...validBook, title: "Riyadh al-Salihin", author: "Al-Nawawi" });

    const res = await request(app).get("/api/books");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

// ── POST /api/books ──────────────────────────────────────────────────────────

describe("POST /api/books", () => {
  it("returns 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/books")
      .send({ title: "AB" }); // title too short and author missing

    expect(res.status).toBe(400);
  });

  it("returns 400 when a book with the same title already exists", async () => {
    await Book.create(validBook);

    const res = await request(app)
      .post("/api/books")
      .send(validBook);

    expect(res.status).toBe(400);
    expect(res.text).toMatch(/already exists/i);
  });

  it("returns 400 when a resource url is not a valid URI", async () => {
    const res = await request(app)
      .post("/api/books")
      .send({
        ...validBook,
        resources: [{ label: "Download", type: "pdf", url: "not-a-url" }],
      });

    expect(res.status).toBe(400);
  });

  it("creates the book and returns it with a 201", async () => {
    const res = await request(app)
      .post("/api/books")
      .send(validBook);

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.title).toBe(validBook.title);
    expect(res.body.author).toBe(validBook.author);
  });

  it("creates a book with nested resources and recommendedEditions", async () => {
    const res = await request(app)
      .post("/api/books")
      .send({
        ...validBook,
        resources: [
          { label: "PDF Download", type: "pdf", url: "https://example.com/book.pdf" },
        ],
        recommendedEditions: [
          { label: "Dar al-Kutub", publisher: "Dar al-Kutub", note: "Best edition" },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.resources).toHaveLength(1);
    expect(res.body.recommendedEditions).toHaveLength(1);
  });
});

// ── PUT /api/books/:id ───────────────────────────────────────────────────────

describe("PUT /api/books/:id", () => {
  it("returns 400 for a malformed ObjectId", async () => {
    const res = await request(app)
      .put("/api/books/not-an-id")
      .send(validBook);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid ID");
  });

  it("returns 404 when the book does not exist", async () => {
    const fakeId = "000000000000000000000000";
    const res = await request(app)
      .put(`/api/books/${fakeId}`)
      .send(validBook);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Book not found");
  });

  it("returns 400 when the payload fails validation", async () => {
    const book = await Book.create(validBook);

    const res = await request(app)
      .put(`/api/books/${book._id}`)
      .send({ title: "X" }); // too short, no author

    expect(res.status).toBe(400);
  });

  it("updates and returns the modified book", async () => {
    const book = await Book.create(validBook);

    const res = await request(app)
      .put(`/api/books/${book._id}`)
      .send({ ...validBook, author: "Updated Author Name" });

    expect(res.status).toBe(200);
    expect(res.body.author).toBe("Updated Author Name");
    expect(res.body._id).toBe(book._id.toString());
  });
});

// ── DELETE /api/books/:id ────────────────────────────────────────────────────

describe("DELETE /api/books/:id", () => {
  it("returns 400 for a malformed ObjectId", async () => {
    const res = await request(app).delete("/api/books/not-an-id");

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid ID");
  });

  it("returns 404 when the book does not exist", async () => {
    const fakeId = "000000000000000000000000";
    const res = await request(app).delete(`/api/books/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Book not found");
  });

  it("deletes the book and returns a success message", async () => {
    const book = await Book.create(validBook);

    const res = await request(app).delete(`/api/books/${book._id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Book deleted");

    const found = await Book.findById(book._id);
    expect(found).toBeNull();
  });
});
