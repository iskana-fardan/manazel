jest.mock("../../../src/repositories/roadmap.repository");
jest.mock("../../../src/repositories/field.repository");

const roadmapRepo = require("../../../src/repositories/roadmap.repository");
const fieldRepo = require("../../../src/repositories/field.repository");
const roadmapService = require("../../../src/services/roadmap.service");
const AppError = require("../../../src/errors/AppError");

const mockField = { _id: "fieldId", slug: "fiqh", name: "Fiqh" };

const makeLevel = (slug, order) => ({ slug, label: slug, order, books: [] });
const makeLevels = () => [makeLevel("beginner", 1), makeLevel("intermediate", 2), makeLevel("advanced", 3)];

const mockRoadmap = () => ({
  _id: "rmId",
  field: "fieldId",
  levels: makeLevels(),
  muthalaah: makeLevels(),
});

describe("roadmap.service", () => {
  describe("getAll", () => {
    it("delegates to the repository", async () => {
      const roadmaps = [{ _id: "r1" }];
      roadmapRepo.findAll.mockResolvedValue(roadmaps);
      const result = await roadmapService.getAll();
      expect(result).toBe(roadmaps);
    });
  });

  describe("getRoadmapByFieldSlug", () => {
    it("throws AppError 404 when field is not found", async () => {
      fieldRepo.findBySlug.mockResolvedValue(null);
      await expect(roadmapService.getRoadmapByFieldSlug("nope"))
        .rejects.toMatchObject({ statusCode: 404, message: "Field not found" });
    });

    it("throws AppError 404 when roadmap is not found for the field", async () => {
      fieldRepo.findBySlug.mockResolvedValue(mockField);
      roadmapRepo.findByFieldId.mockResolvedValue(null);
      await expect(roadmapService.getRoadmapByFieldSlug("fiqh"))
        .rejects.toMatchObject({ statusCode: 404, message: "Roadmap not found" });
    });

    it("returns the roadmap when found", async () => {
      const roadmap = mockRoadmap();
      fieldRepo.findBySlug.mockResolvedValue(mockField);
      roadmapRepo.findByFieldId.mockResolvedValue(roadmap);
      const result = await roadmapService.getRoadmapByFieldSlug("fiqh");
      expect(result).toBe(roadmap);
    });
  });

  describe("createRoadmap", () => {
    it("throws AppError 404 when field is not found", async () => {
      fieldRepo.findBySlug.mockResolvedValue(null);
      await expect(roadmapService.createRoadmap("nope"))
        .rejects.toMatchObject({ statusCode: 404, message: "Field not found" });
    });

    it("throws AppError 400 when roadmap already exists for the field", async () => {
      fieldRepo.findBySlug.mockResolvedValue(mockField);
      roadmapRepo.findByFieldId.mockResolvedValue({ _id: "existing" });
      await expect(roadmapService.createRoadmap("fiqh"))
        .rejects.toMatchObject({ statusCode: 400, message: "Roadmap already exists for this field" });
    });

    it("creates roadmap with three default levels in each section", async () => {
      fieldRepo.findBySlug.mockResolvedValue(mockField);
      roadmapRepo.findByFieldId.mockResolvedValue(null);
      roadmapRepo.create.mockResolvedValue({ field: "fieldId", levels: makeLevels(), muthalaah: makeLevels() });

      const result = await roadmapService.createRoadmap("fiqh");

      expect(roadmapRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          field: mockField._id,
          title: mockField.name,
          levels: expect.arrayContaining([expect.objectContaining({ slug: "beginner" })]),
        }),
      );
      expect(result.levels).toHaveLength(3);
    });
  });

  describe("addBookToSection", () => {
    const bookId = "000000000000000000000001";

    it("throws AppError 400 for an invalid section name", async () => {
      await expect(roadmapService.addBookToSection("fiqh", "invalid", "beginner", bookId))
        .rejects.toMatchObject({ statusCode: 400, message: "Invalid section" });
    });

    it("throws AppError 404 when roadmap is not found", async () => {
      fieldRepo.findBySlug.mockResolvedValue(null);
      await expect(roadmapService.addBookToSection("fiqh", "dars", "beginner", bookId))
        .rejects.toMatchObject({ statusCode: 404, message: "Roadmap not found" });
    });

    it("throws AppError 404 for an invalid level slug", async () => {
      const roadmap = mockRoadmap();
      fieldRepo.findBySlug.mockResolvedValue(mockField);
      roadmapRepo.findByFieldId.mockResolvedValue(roadmap);
      await expect(roadmapService.addBookToSection("fiqh", "dars", "expert", bookId))
        .rejects.toMatchObject({ statusCode: 404, message: "Level not found" });
    });

    it("throws AppError 400 when book is already in the level", async () => {
      const roadmap = mockRoadmap();
      roadmap.levels[0].books = [{ toString: () => bookId }];
      fieldRepo.findBySlug.mockResolvedValue(mockField);
      roadmapRepo.findByFieldId.mockResolvedValue(roadmap);
      roadmapRepo.save.mockResolvedValue(roadmap);

      await expect(roadmapService.addBookToSection("fiqh", "dars", "beginner", bookId))
        .rejects.toMatchObject({ statusCode: 400, message: "Book already in this level" });
    });

    it("adds the book and saves the roadmap", async () => {
      const roadmap = mockRoadmap();
      fieldRepo.findBySlug.mockResolvedValue(mockField);
      roadmapRepo.findByFieldId.mockResolvedValue(roadmap);
      roadmapRepo.save.mockResolvedValue(roadmap);

      await roadmapService.addBookToSection("fiqh", "dars", "beginner", bookId);

      expect(roadmap.levels[0].books).toContain(bookId);
      expect(roadmapRepo.save).toHaveBeenCalledWith(roadmap);
    });

    it("adds book to muthalaah section using the correct array", async () => {
      const roadmap = mockRoadmap();
      fieldRepo.findBySlug.mockResolvedValue(mockField);
      roadmapRepo.findByFieldId.mockResolvedValue(roadmap);
      roadmapRepo.save.mockResolvedValue(roadmap);

      await roadmapService.addBookToSection("fiqh", "muthalaah", "advanced", bookId);

      expect(roadmap.muthalaah[2].books).toContain(bookId);
      expect(roadmap.levels[2].books).toHaveLength(0);
    });
  });

  describe("removeBookFromSection", () => {
    const bookId = "000000000000000000000001";

    it("throws AppError 400 for an invalid section name", async () => {
      await expect(roadmapService.removeBookFromSection("fiqh", "nope", "beginner", bookId))
        .rejects.toMatchObject({ statusCode: 400, message: "Invalid section" });
    });

    it("throws AppError 404 when roadmap is not found", async () => {
      fieldRepo.findBySlug.mockResolvedValue(null);
      await expect(roadmapService.removeBookFromSection("fiqh", "dars", "beginner", bookId))
        .rejects.toMatchObject({ statusCode: 404, message: "Roadmap not found" });
    });

    it("throws AppError 404 for an invalid level slug", async () => {
      const roadmap = mockRoadmap();
      fieldRepo.findBySlug.mockResolvedValue(mockField);
      roadmapRepo.findByFieldId.mockResolvedValue(roadmap);
      await expect(roadmapService.removeBookFromSection("fiqh", "dars", "expert", bookId))
        .rejects.toMatchObject({ statusCode: 404, message: "Level not found" });
    });

    it("removes the book from the level and saves", async () => {
      const roadmap = mockRoadmap();
      roadmap.levels[0].books = [{ toString: () => bookId }];
      fieldRepo.findBySlug.mockResolvedValue(mockField);
      roadmapRepo.findByFieldId.mockResolvedValue(roadmap);
      roadmapRepo.save.mockResolvedValue(roadmap);

      await roadmapService.removeBookFromSection("fiqh", "dars", "beginner", bookId);

      expect(roadmap.levels[0].books).toHaveLength(0);
      expect(roadmapRepo.save).toHaveBeenCalledWith(roadmap);
    });
  });
});
