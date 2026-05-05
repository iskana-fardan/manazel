jest.mock("../../../src/repositories/field.repository");

const fieldRepo = require("../../../src/repositories/field.repository");
const fieldService = require("../../../src/services/field.service");
const AppError = require("../../../src/errors/AppError");

const validData = { slug: "fiqh", name: "Fiqh", nameArabic: "الفقه", description: "desc", icon: "book", order: 1 };

describe("field.service", () => {
  describe("getAll", () => {
    it("delegates to the repository", async () => {
      const fields = [validData];
      fieldRepo.findAll.mockResolvedValue(fields);
      const result = await fieldService.getAll();
      expect(fieldRepo.findAll).toHaveBeenCalled();
      expect(result).toBe(fields);
    });
  });

  describe("create", () => {
    it("throws AppError 400 when slug already exists", async () => {
      fieldRepo.findBySlug.mockResolvedValue({ slug: "fiqh" });
      await expect(fieldService.create(validData))
        .rejects.toMatchObject({ statusCode: 400, message: "Field already exists" });
    });

    it("creates and returns the new field when slug is unique", async () => {
      fieldRepo.findBySlug.mockResolvedValue(null);
      const created = { _id: "abc", ...validData };
      fieldRepo.create.mockResolvedValue(created);

      const result = await fieldService.create(validData);

      expect(fieldRepo.create).toHaveBeenCalledWith(validData);
      expect(result).toBe(created);
    });
  });

  describe("update", () => {
    it("throws AppError 400 when slug is taken by another document", async () => {
      fieldRepo.findBySlugExcluding.mockResolvedValue({ slug: "fiqh", _id: "other" });
      await expect(fieldService.update("id1", validData))
        .rejects.toMatchObject({ statusCode: 400, message: "Slug already exists" });
    });

    it("throws AppError 404 when field does not exist", async () => {
      fieldRepo.findBySlugExcluding.mockResolvedValue(null);
      fieldRepo.update.mockResolvedValue(null);
      await expect(fieldService.update("id1", validData))
        .rejects.toMatchObject({ statusCode: 404, message: "Field not found" });
    });

    it("returns the updated field on success", async () => {
      const updated = { _id: "id1", ...validData, name: "Updated" };
      fieldRepo.findBySlugExcluding.mockResolvedValue(null);
      fieldRepo.update.mockResolvedValue(updated);

      const result = await fieldService.update("id1", validData);

      expect(result).toBe(updated);
    });
  });

  describe("remove", () => {
    it("throws AppError 404 when field does not exist", async () => {
      fieldRepo.remove.mockResolvedValue(null);
      await expect(fieldService.remove("id1"))
        .rejects.toMatchObject({ statusCode: 404, message: "Field not found" });
    });

    it("resolves without returning a value on success", async () => {
      fieldRepo.remove.mockResolvedValue({ _id: "id1" });
      await expect(fieldService.remove("id1")).resolves.toBeUndefined();
    });
  });
});
