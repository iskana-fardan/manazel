jest.mock("mongoose", () => {
  const isValid = jest.fn();
  return {
    Types: { ObjectId: { isValid } },
    default: { Types: { ObjectId: { isValid } } },
  };
});

jest.mock("../../../src/models/contributor.model", () => {
  const MockContributor = jest.fn(() => ({ save: jest.fn() }));
  MockContributor.find = jest.fn();
  MockContributor.findByIdAndDelete = jest.fn();
  MockContributor.findByIdAndUpdate = jest.fn();
  return { Contributor: MockContributor, validate: jest.fn() };
});

const mongoose = require("mongoose");
const { Contributor, validate } = require("../../../src/models/contributor.model");
const {
  getContributors,
  createContributor,
  deleteContributor,
  updateContributor,
} = require("../../../src/controllers/contributor.controller");

const mockIsValid = mongoose.Types.ObjectId.isValid;
const VALID_ID = "507f1f77bcf86cd799439011";

const validBody = {
  name: "John Doe",
  role: "Developer",
  description: "A contributor",
  avatar: "https://example.com/avatar.png",
  socials: {
    github: "https://github.com/johndoe",
    instagram: "@johndoe",
    website: "https://johndoe.dev",
  },
};

describe("contributor.controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  // ── getContributors ───────────────────────────────────────────────────────

  describe("getContributors", () => {
    it("returns 200 with all contributors", async () => {
      const contributors = [{ name: "Alice" }, { name: "Bob" }];
      Contributor.find.mockResolvedValue(contributors);

      await getContributors(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(contributors);
    });

    it("returns 200 with empty array when no contributors exist", async () => {
      Contributor.find.mockResolvedValue([]);
      await getContributors(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith([]);
    });
  });

  // ── createContributor ─────────────────────────────────────────────────────

  describe("createContributor", () => {
    it("returns 400 when Joi validation fails", async () => {
      validate.mockReturnValue({ error: { details: [{ message: '"name" is required' }] } });

      await createContributor(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('"name" is required');
    });

    it("saves and returns the new contributor on success", async () => {
      validate.mockReturnValue({ error: null });
      req.body = { ...validBody };
      const mockInstance = { ...validBody, save: jest.fn().mockResolvedValue() };
      Contributor.mockImplementation(() => mockInstance);

      await createContributor(req, res);

      expect(mockInstance.save).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith(mockInstance);
    });
  });

  // ── deleteContributor ─────────────────────────────────────────────────────

  describe("deleteContributor", () => {
    it("returns 400 for an invalid ObjectId", async () => {
      req.params.id = "bad-id";
      mockIsValid.mockReturnValue(false);

      await deleteContributor(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid ID" });
    });

    it("returns 404 when contributor does not exist", async () => {
      req.params.id = VALID_ID;
      mockIsValid.mockReturnValue(true);
      Contributor.findByIdAndDelete.mockResolvedValue(null);

      await deleteContributor(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Contributor not found" });
    });

    it("returns success message on deletion", async () => {
      req.params.id = VALID_ID;
      mockIsValid.mockReturnValue(true);
      Contributor.findByIdAndDelete.mockResolvedValue({ name: "John" });

      await deleteContributor(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: "Contributor deleted" });
    });
  });

  // ── updateContributor ─────────────────────────────────────────────────────

  describe("updateContributor", () => {
    it("returns 400 for an invalid ObjectId", async () => {
      req.params.id = "bad";
      mockIsValid.mockReturnValue(false);

      await updateContributor(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid ID" });
    });

    it("returns 400 when Joi validation fails", async () => {
      req.params.id = VALID_ID;
      mockIsValid.mockReturnValue(true);
      validate.mockReturnValue({ error: { details: [{ message: '"name" length must be at least 3' }] } });

      await updateContributor(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('"name" length must be at least 3');
    });

    it("returns 404 when contributor does not exist", async () => {
      req.params.id = VALID_ID;
      req.body = { ...validBody };
      mockIsValid.mockReturnValue(true);
      validate.mockReturnValue({ error: null });
      Contributor.findByIdAndUpdate.mockResolvedValue(null);

      await updateContributor(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Contributor not found" });
    });

    it("returns 200 with updated contributor on success", async () => {
      const updated = { _id: VALID_ID, ...validBody };
      req.params.id = VALID_ID;
      req.body = { ...validBody };
      mockIsValid.mockReturnValue(true);
      validate.mockReturnValue({ error: null });
      Contributor.findByIdAndUpdate.mockResolvedValue(updated);

      await updateContributor(req, res);

      expect(Contributor.findByIdAndUpdate).toHaveBeenCalledWith(
        VALID_ID,
        expect.objectContaining({ name: validBody.name }),
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });
  });
});
