jest.mock("../../../src/models/roadmap.model", () => {
  const MockRoadmap = jest.fn(() => ({ save: jest.fn() }));
  MockRoadmap.find = jest.fn();
  MockRoadmap.findOne = jest.fn();
  return { Roadmap: MockRoadmap };
});

jest.mock("../../../src/models/field.model", () => {
  const MockField = jest.fn();
  MockField.findOne = jest.fn();
  return { Field: MockField, validate: jest.fn() };
});

const { Roadmap } = require("../../../src/models/roadmap.model");
const { Field } = require("../../../src/models/field.model");
const {
  getAllRoadmaps,
  getRoadmapByField,
  createRoadmap,
  addBookToSection,
  removeBookFromSection,
} = require("../../../src/controllers/roadmap.controller");

const FIELD_ID = "507f1f77bcf86cd799439011";
const BOOK_ID = "507f1f77bcf86cd799439022";

function makeRoadmap(overrides = {}) {
  return {
    levels: [
      { slug: "beginner", books: [], label: "Beginner", order: 1 },
      { slug: "intermediate", books: [], label: "Intermediate", order: 2 },
      { slug: "advanced", books: [], label: "Advanced", order: 3 },
    ],
    muthalaah: [
      { slug: "beginner", books: [], label: "Beginner", order: 1 },
      { slug: "intermediate", books: [], label: "Intermediate", order: 2 },
      { slug: "advanced", books: [], label: "Advanced", order: 3 },
    ],
    save: jest.fn().mockResolvedValue(),
    ...overrides,
  };
}

describe("roadmap.controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  // ── getAllRoadmaps ─────────────────────────────────────────────────────────

  describe("getAllRoadmaps", () => {
    it("returns 200 with all roadmaps", async () => {
      const roadmaps = [{ title: "Fiqh Roadmap" }];
      Roadmap.find.mockResolvedValue(roadmaps);

      await getAllRoadmaps(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(roadmaps);
    });
  });

  // ── getRoadmapByField ──────────────────────────────────────────────────────

  describe("getRoadmapByField", () => {
    it("returns 404 when field does not exist", async () => {
      req.params.fieldSlug = "unknown";
      Field.findOne.mockResolvedValue(null);

      await getRoadmapByField(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("No roadmap found");
    });

    it("returns 404 when roadmap for the field does not exist", async () => {
      req.params.fieldSlug = "fiqh";
      Field.findOne.mockResolvedValue({ _id: FIELD_ID });
      Roadmap.findOne.mockResolvedValue(null);

      await getRoadmapByField(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("No roadmap found");
    });

    it("returns 200 with the roadmap on success", async () => {
      const roadmap = makeRoadmap({ title: "Fiqh" });
      req.params.fieldSlug = "fiqh";
      Field.findOne.mockResolvedValue({ _id: FIELD_ID });
      Roadmap.findOne.mockResolvedValue(roadmap);

      await getRoadmapByField(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(roadmap);
    });
  });

  // ── createRoadmap ──────────────────────────────────────────────────────────

  describe("createRoadmap", () => {
    it("returns 404 when field does not exist", async () => {
      req.params.fieldSlug = "nonexistent";
      Field.findOne.mockResolvedValue(null);

      await createRoadmap(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Field not found");
    });

    it("returns 400 when a roadmap for the field already exists", async () => {
      req.params.fieldSlug = "fiqh";
      Field.findOne.mockResolvedValue({ _id: FIELD_ID, name: "Fiqh" });
      Roadmap.findOne.mockResolvedValue({ title: "Existing" });

      await createRoadmap(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Roadmap already exists for this field");
    });

    it("creates roadmap with default levels and returns 201", async () => {
      req.params.fieldSlug = "fiqh";
      const field = { _id: FIELD_ID, name: "Fiqh" };
      Field.findOne.mockResolvedValue(field);
      Roadmap.findOne.mockResolvedValue(null);
      const mockInstance = { title: "Fiqh", save: jest.fn().mockResolvedValue() };
      Roadmap.mockImplementation(() => mockInstance);

      await createRoadmap(req, res);

      expect(Roadmap).toHaveBeenCalledWith(
        expect.objectContaining({
          field: FIELD_ID,
          title: "Fiqh",
          levels: expect.arrayContaining([
            expect.objectContaining({ slug: "beginner" }),
            expect.objectContaining({ slug: "intermediate" }),
            expect.objectContaining({ slug: "advanced" }),
          ]),
        })
      );
      expect(mockInstance.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockInstance);
    });
  });

  // ── addBookToSection ───────────────────────────────────────────────────────

  describe("addBookToSection", () => {
    it("returns 404 when roadmap is not found", async () => {
      req.params = { fieldSlug: "fiqh", section: "dars", levelSlug: "beginner" };
      req.body = { bookId: BOOK_ID };
      Field.findOne.mockResolvedValue(null);

      await addBookToSection(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Roadmap not found");
    });

    it("returns 404 when level slug does not exist in section", async () => {
      req.params = { fieldSlug: "fiqh", section: "dars", levelSlug: "expert" };
      req.body = { bookId: BOOK_ID };
      Field.findOne.mockResolvedValue({ _id: FIELD_ID });
      Roadmap.findOne.mockResolvedValue(makeRoadmap());

      await addBookToSection(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Level not found");
    });

    it("returns 400 when book is already in the level", async () => {
      req.params = { fieldSlug: "fiqh", section: "dars", levelSlug: "beginner" };
      req.body = { bookId: BOOK_ID };
      const roadmap = makeRoadmap();
      roadmap.levels[0].books = [{ toString: () => BOOK_ID }];
      Field.findOne.mockResolvedValue({ _id: FIELD_ID });
      Roadmap.findOne.mockResolvedValue(roadmap);

      await addBookToSection(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Book already in this level");
    });

    it("adds book to dars section and returns 200", async () => {
      req.params = { fieldSlug: "fiqh", section: "dars", levelSlug: "beginner" };
      req.body = { bookId: BOOK_ID };
      const roadmap = makeRoadmap();
      Field.findOne.mockResolvedValue({ _id: FIELD_ID });
      Roadmap.findOne.mockResolvedValue(roadmap);

      await addBookToSection(req, res);

      expect(roadmap.levels[0].books).toContain(BOOK_ID);
      expect(roadmap.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(roadmap);
    });

    it("adds book to muthalaah section", async () => {
      req.params = { fieldSlug: "fiqh", section: "muthalaah", levelSlug: "intermediate" };
      req.body = { bookId: BOOK_ID };
      const roadmap = makeRoadmap();
      Field.findOne.mockResolvedValue({ _id: FIELD_ID });
      Roadmap.findOne.mockResolvedValue(roadmap);

      await addBookToSection(req, res);

      expect(roadmap.muthalaah[1].books).toContain(BOOK_ID);
      expect(roadmap.save).toHaveBeenCalled();
    });
  });

  // ── removeBookFromSection ──────────────────────────────────────────────────

  describe("removeBookFromSection", () => {
    it("returns 404 when roadmap is not found", async () => {
      req.params = { fieldSlug: "fiqh", section: "dars", levelSlug: "beginner", bookId: BOOK_ID };
      Field.findOne.mockResolvedValue(null);

      await removeBookFromSection(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Roadmap not found");
    });

    it("returns 404 when level does not exist", async () => {
      req.params = { fieldSlug: "fiqh", section: "dars", levelSlug: "expert", bookId: BOOK_ID };
      Field.findOne.mockResolvedValue({ _id: FIELD_ID });
      Roadmap.findOne.mockResolvedValue(makeRoadmap());

      await removeBookFromSection(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Level not found");
    });

    it("removes the book and saves the roadmap", async () => {
      req.params = { fieldSlug: "fiqh", section: "dars", levelSlug: "beginner", bookId: BOOK_ID };
      const roadmap = makeRoadmap();
      roadmap.levels[0].books = [{ toString: () => BOOK_ID }, { toString: () => "otherid" }];
      Field.findOne.mockResolvedValue({ _id: FIELD_ID });
      Roadmap.findOne.mockResolvedValue(roadmap);

      await removeBookFromSection(req, res);

      const remaining = roadmap.levels[0].books.map((b) => b.toString());
      expect(remaining).not.toContain(BOOK_ID);
      expect(remaining).toContain("otherid");
      expect(roadmap.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(roadmap);
    });

    it("removes from muthalaah section", async () => {
      req.params = { fieldSlug: "fiqh", section: "muthalaah", levelSlug: "advanced", bookId: BOOK_ID };
      const roadmap = makeRoadmap();
      roadmap.muthalaah[2].books = [{ toString: () => BOOK_ID }];
      Field.findOne.mockResolvedValue({ _id: FIELD_ID });
      Roadmap.findOne.mockResolvedValue(roadmap);

      await removeBookFromSection(req, res);

      expect(roadmap.muthalaah[2].books).toHaveLength(0);
      expect(roadmap.save).toHaveBeenCalled();
    });
  });
});
