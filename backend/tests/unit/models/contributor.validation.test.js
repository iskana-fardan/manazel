jest.mock("mongoose", () => {
  const Schema = jest.fn().mockImplementation(() => ({}));
  Schema.Types = { ObjectId: {} };
  return { Schema, model: jest.fn() };
});

const { validate } = require("../../../src/models/contributor.model");

describe("contributor Joi validation", () => {
  const valid = {
    name: "John Doe",
    role: "Developer",
    description: "A contributor to the project",
    avatar: "https://example.com/avatar.png",
    socials: {
      github: "https://github.com/johndoe",
      instagram: "@johndoe",
      website: "https://johndoe.dev",
    },
  };

  it("passes with all fields provided", () => {
    const { error } = validate(valid);
    expect(error).toBeUndefined();
  });

  it("passes without optional socials", () => {
    const { socials, ...rest } = valid;
    const { error } = validate(rest);
    expect(error).toBeUndefined();
  });

  it("passes without optional avatar", () => {
    const { avatar, ...rest } = valid;
    const { error } = validate(rest);
    expect(error).toBeUndefined();
  });

  it("fails when name is missing", () => {
    const { name, ...rest } = valid;
    const { error } = validate(rest);
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/name/i);
  });

  it("fails when role is missing", () => {
    const { role, ...rest } = valid;
    const { error } = validate(rest);
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/role/i);
  });

  it("fails when name is shorter than 3 characters", () => {
    const { error } = validate({ ...valid, name: "Jo" });
    expect(error).toBeDefined();
  });

  it("fails when name exceeds 50 characters", () => {
    const { error } = validate({ ...valid, name: "A".repeat(51) });
    expect(error).toBeDefined();
  });

  it("fails when role exceeds 100 characters", () => {
    const { error } = validate({ ...valid, role: "A".repeat(101) });
    expect(error).toBeDefined();
  });

  it("fails when description exceeds 500 characters", () => {
    const { error } = validate({ ...valid, description: "A".repeat(501) });
    expect(error).toBeDefined();
  });

  it("fails when avatar is not a valid URI", () => {
    const { error } = validate({ ...valid, avatar: "not-a-url" });
    expect(error).toBeDefined();
  });

  it("fails when socials.github is not a valid URI", () => {
    const { error } = validate({
      ...valid,
      socials: { ...valid.socials, github: "not-a-url" },
    });
    expect(error).toBeDefined();
  });

  it("fails when socials.website is not a valid URI", () => {
    const { error } = validate({
      ...valid,
      socials: { ...valid.socials, website: "not-a-url" },
    });
    expect(error).toBeDefined();
  });
});
