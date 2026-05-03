jest.mock("mongoose", () => {
  const Schema = jest.fn().mockImplementation(() => ({}));
  Schema.Types = { ObjectId: {} };
  return { Schema, model: jest.fn() };
});

const { validate } = require("../../../src/models/book.model");

describe("book Joi validation", () => {
  const valid = {
    title: "Al-Muwatta",
    author: "Imam Malik",
  };

  it("passes with only required fields", () => {
    const { error } = validate(valid);
    expect(error).toBeUndefined();
  });

  it("passes with all optional fields", () => {
    const { error } = validate({
      ...valid,
      titleArabic: "الموطأ",
      type: "hadith",
      level: "intermediate",
      field: "hadith",
      description: "A classic hadith collection",
      recommendedUsage: "Study with a teacher",
      resources: [{ label: "PDF Link", type: "pdf", url: "https://example.com/book.pdf" }],
      recommendedEditions: [{ label: "Maktabah Edition", publisher: "Maktabah", note: "Best print" }],
    });
    expect(error).toBeUndefined();
  });

  it("fails when title is missing", () => {
    const { error } = validate({ author: "Author" });
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/title/i);
  });

  it("fails when author is missing", () => {
    const { error } = validate({ title: "Some Book" });
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/author/i);
  });

  it("fails when title is shorter than 3 characters", () => {
    const { error } = validate({ title: "AB", author: "Author" });
    expect(error).toBeDefined();
  });

  it("fails when title exceeds 255 characters", () => {
    const { error } = validate({ title: "A".repeat(256), author: "Author" });
    expect(error).toBeDefined();
  });

  it("fails when author exceeds 255 characters", () => {
    const { error } = validate({ title: "Valid Title", author: "A".repeat(256) });
    expect(error).toBeDefined();
  });

  it("fails when a resource is missing its url", () => {
    const { error } = validate({
      ...valid,
      resources: [{ label: "Link", type: "pdf" }],
    });
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/url/i);
  });

  it("fails when a resource url is not a valid URI", () => {
    const { error } = validate({
      ...valid,
      resources: [{ label: "Link", type: "pdf", url: "not-a-url" }],
    });
    expect(error).toBeDefined();
  });

  it("fails when a resource is missing its label", () => {
    const { error } = validate({
      ...valid,
      resources: [{ type: "pdf", url: "https://example.com" }],
    });
    expect(error).toBeDefined();
  });

  it("fails when an edition label is missing", () => {
    const { error } = validate({
      ...valid,
      recommendedEditions: [{ publisher: "Pub" }],
    });
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/label/i);
  });

  it("fails when description exceeds 500 characters", () => {
    const { error } = validate({ ...valid, description: "A".repeat(501) });
    expect(error).toBeDefined();
  });
});
