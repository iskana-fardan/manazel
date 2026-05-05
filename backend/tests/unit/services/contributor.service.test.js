jest.mock("../../../src/repositories/contributor.repository");

const contributorRepo = require("../../../src/repositories/contributor.repository");
const contributorService = require("../../../src/services/contributor.service");
const AppError = require("../../../src/errors/AppError");

const validData = { name: "Ahmad Abdullah", role: "Researcher", description: "Scholar", avatar: "https://example.com/a.jpg" };

describe("contributor.service", () => {
  describe("getAll", () => {
    it("delegates to the repository", async () => {
      const contributors = [validData];
      contributorRepo.findAll.mockResolvedValue(contributors);
      const result = await contributorService.getAll();
      expect(result).toBe(contributors);
    });
  });

  describe("create", () => {
    it("creates and returns the new contributor", async () => {
      const created = { _id: "abc", ...validData };
      contributorRepo.create.mockResolvedValue(created);
      const result = await contributorService.create(validData);
      expect(contributorRepo.create).toHaveBeenCalledWith(validData);
      expect(result).toBe(created);
    });
  });

  describe("update", () => {
    it("throws AppError 404 when contributor does not exist", async () => {
      contributorRepo.update.mockResolvedValue(null);
      await expect(contributorService.update("id1", validData))
        .rejects.toMatchObject({ statusCode: 404, message: "Contributor not found" });
    });

    it("returns the updated contributor on success", async () => {
      const updated = { _id: "id1", ...validData, role: "Senior Researcher" };
      contributorRepo.update.mockResolvedValue(updated);
      const result = await contributorService.update("id1", validData);
      expect(result).toBe(updated);
    });
  });

  describe("remove", () => {
    it("throws AppError 404 when contributor does not exist", async () => {
      contributorRepo.remove.mockResolvedValue(null);
      await expect(contributorService.remove("id1"))
        .rejects.toMatchObject({ statusCode: 404, message: "Contributor not found" });
    });

    it("resolves without returning a value on success", async () => {
      contributorRepo.remove.mockResolvedValue({ _id: "id1" });
      await expect(contributorService.remove("id1")).resolves.toBeUndefined();
    });
  });
});
