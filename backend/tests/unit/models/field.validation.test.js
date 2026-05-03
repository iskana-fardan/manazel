jest.mock("mongoose", () => {
  const Schema = jest.fn().mockImplementation(() => ({}));
  Schema.Types = { ObjectId: {} };
  return { Schema, model: jest.fn() };
});

const { validate } = require("../../../src/models/field.model");

describe("field Joi validation", () => {
  const valid = {
    slug: "fiqh",
    name: "Fiqh",
    nameArabic: "الفقه",
    description: "Islamic jurisprudence",
    icon: "⚖️",
    order: 1,
  };

  it("passes with all required fields", () => {
    const { error } = validate(valid);
    expect(error).toBeUndefined();
  });

  it("fails when slug is missing", () => {
    const { slug, ...rest } = valid;
    const { error } = validate(rest);
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/slug/i);
  });

  it("fails when name is missing", () => {
    const { name, ...rest } = valid;
    const { error } = validate(rest);
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/name/i);
  });

  it("fails when nameArabic is missing", () => {
    const { nameArabic, ...rest } = valid;
    const { error } = validate(rest);
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/nameArabic/i);
  });

  it("fails when description is missing", () => {
    const { description, ...rest } = valid;
    const { error } = validate(rest);
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/description/i);
  });

  it("fails when icon is missing", () => {
    const { icon, ...rest } = valid;
    const { error } = validate(rest);
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/icon/i);
  });

  it("fails when order is missing", () => {
    const { order, ...rest } = valid;
    const { error } = validate(rest);
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/order/i);
  });

  it("fails when order is not a number", () => {
    const { error } = validate({ ...valid, order: "first" });
    expect(error).toBeDefined();
  });
});
