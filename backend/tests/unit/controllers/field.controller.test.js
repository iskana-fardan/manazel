jest.mock("mongoose", () => {
  const isValid = jest.fn();
  return {
    Types: { ObjectId: { isValid } },
    default: { Types: { ObjectId: { isValid } } },
  };
});

jest.mock("../../../src/models/field.model", () => {
  const MockField = jest.fn(() => ({ save: jest.fn() }));
  MockField.find = jest.fn();
  MockField.findOne = jest.fn();
  MockField.findByIdAndDelete = jest.fn();
  MockField.findByIdAndUpdate = jest.fn();
  return { Field: MockField, validate: jest.fn() };
});

const mongoose = require("mongoose");
const { Field, validate } = require("../../../src/models/field.model");
const { getFields, createField, deleteField, updateField } = require("../../../src/controllers/field.controller");

const mockIsValid = mongoose.Types.ObjectId.isValid;
const VALID_ID = "507f1f77bcf86cd799439011";

const validBody = {
  slug: "fiqh",
  name: "Fiqh",
  nameArabic: "الفقه",
  description: "Study of Islamic jurisprudence",
  icon: "⚖️",
  order: 1,
};

describe("field.controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  // ── getFields ─────────────────────────────────────────────────────────────

  describe("getFields", () => {
    it("returns all fields sorted by order", async () => {
      const fields = [{ name: "Fiqh", order: 1 }];
      const sortMock = jest.fn().mockResolvedValue(fields);
      Field.find.mockReturnValue({ sort: sortMock });

      await getFields(req, res);

      expect(Field.find).toHaveBeenCalled();
      expect(sortMock).toHaveBeenCalledWith({ order: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(fields);
    });
  });

  // ── createField ───────────────────────────────────────────────────────────

  describe("createField", () => {
    it("returns 400 when Joi validation fails", async () => {
      validate.mockReturnValue({ error: { details: [{ message: '"slug" is required' }] } });

      await createField(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('"slug" is required');
    });

    it("returns 400 when slug already exists", async () => {
      validate.mockReturnValue({ error: null });
      req.body = { ...validBody };
      Field.findOne.mockResolvedValue({ slug: "fiqh" });

      await createField(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Field already exists");
    });

    it("saves and returns the new field on success", async () => {
      validate.mockReturnValue({ error: null });
      req.body = { ...validBody };
      Field.findOne.mockResolvedValue(null);
      const mockInstance = { ...validBody, save: jest.fn().mockResolvedValue() };
      Field.mockImplementation(() => mockInstance);

      await createField(req, res);

      expect(mockInstance.save).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith(mockInstance);
    });
  });

  // ── deleteField ───────────────────────────────────────────────────────────

  describe("deleteField", () => {
    it("returns 400 for an invalid ObjectId", async () => {
      req.params.id = "bad-id";
      mockIsValid.mockReturnValue(false);

      await deleteField(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid ID" });
    });

    it("returns 404 when field does not exist", async () => {
      req.params.id = VALID_ID;
      mockIsValid.mockReturnValue(true);
      Field.findByIdAndDelete.mockResolvedValue(null);

      await deleteField(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Field not found" });
    });

    it("returns success message on deletion", async () => {
      req.params.id = VALID_ID;
      mockIsValid.mockReturnValue(true);
      Field.findByIdAndDelete.mockResolvedValue({ name: "Fiqh" });

      await deleteField(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: "Field deleted" });
    });
  });

  // ── updateField ───────────────────────────────────────────────────────────

  describe("updateField", () => {
    it("returns 400 for an invalid ObjectId", async () => {
      req.params.id = "bad";
      mockIsValid.mockReturnValue(false);

      await updateField(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid ID" });
    });

    it("returns 400 when Joi validation fails", async () => {
      req.params.id = VALID_ID;
      mockIsValid.mockReturnValue(true);
      validate.mockReturnValue({ error: { details: [{ message: '"order" is required' }] } });

      await updateField(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('"order" is required');
    });

    it("returns 400 when slug is used by another document", async () => {
      req.params.id = VALID_ID;
      req.body = { ...validBody };
      mockIsValid.mockReturnValue(true);
      validate.mockReturnValue({ error: null });
      Field.findOne.mockResolvedValue({ _id: "otherId", slug: "fiqh" });

      await updateField(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Slug already exists" });
    });

    it("returns 404 when field does not exist", async () => {
      req.params.id = VALID_ID;
      req.body = { ...validBody };
      mockIsValid.mockReturnValue(true);
      validate.mockReturnValue({ error: null });
      Field.findOne.mockResolvedValue(null);
      Field.findByIdAndUpdate.mockResolvedValue(null);

      await updateField(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Field not found" });
    });

    it("returns the updated field on success", async () => {
      const updated = { _id: VALID_ID, ...validBody };
      req.params.id = VALID_ID;
      req.body = { ...validBody };
      mockIsValid.mockReturnValue(true);
      validate.mockReturnValue({ error: null });
      Field.findOne.mockResolvedValue(null);
      Field.findByIdAndUpdate.mockResolvedValue(updated);

      await updateField(req, res);

      expect(Field.findByIdAndUpdate).toHaveBeenCalledWith(
        VALID_ID,
        expect.objectContaining({ slug: validBody.slug }),
        { new: true, runValidators: true }
      );
      expect(res.json).toHaveBeenCalledWith(updated);
    });
  });
});
