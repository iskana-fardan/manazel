const request = require("supertest");
const app = require("../../src/app");
const { Contributor } = require("../../src/models/contributor.model");
const { connect, disconnect, clearCollections } = require("./setup/db");
const { getAuthCookie } = require("./setup/auth");

beforeAll(connect);
afterAll(disconnect);
afterEach(clearCollections);

const validContributor = {
  name: "Ahmad Abdullah",
  role: "Researcher",
  description: "Islamic scholar and researcher with 10 years experience",
  avatar: "https://example.com/avatar.jpg",
  socials: {
    github: "https://github.com/ahmad",
    instagram: "ahmad_dev",
    website: "https://ahmad.dev",
  },
};

// ── GET /api/contributors ────────────────────────────────────────────────────

describe("GET /api/contributors", () => {
  it("returns 200 with an empty array when no contributors exist", async () => {
    const res = await request(app).get("/api/contributors");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns all contributors", async () => {
    await Contributor.create(validContributor);
    await Contributor.create({ ...validContributor, name: "Bilal Umar" });

    const res = await request(app).get("/api/contributors");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

// ── POST /api/contributors ───────────────────────────────────────────────────

describe("POST /api/contributors", () => {
  it("returns 401 without an auth cookie", async () => {
    const res = await request(app).post("/api/contributors").send(validContributor);

    expect(res.status).toBe(401);
  });

  it("returns 400 when required fields are missing", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/api/contributors")
      .set("Cookie", cookie)
      .send({ name: "AB" });

    expect(res.status).toBe(400);
  });

  it("returns 400 when the avatar URL is invalid", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/api/contributors")
      .set("Cookie", cookie)
      .send({ ...validContributor, avatar: "not-a-url" });

    expect(res.status).toBe(400);
  });

  it("creates a contributor and returns it with a 200", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .post("/api/contributors")
      .set("Cookie", cookie)
      .send(validContributor);

    expect(res.status).toBe(200);
    expect(res.body._id).toBeDefined();
    expect(res.body.name).toBe(validContributor.name);
    expect(res.body.socials.github).toBe(validContributor.socials.github);
  });

  it("creates a contributor without optional socials field", async () => {
    const cookie = await getAuthCookie();
    const { socials, ...withoutSocials } = validContributor;

    const res = await request(app)
      .post("/api/contributors")
      .set("Cookie", cookie)
      .send(withoutSocials);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe(validContributor.name);
  });
});

// ── PUT /api/contributors/:id ────────────────────────────────────────────────

describe("PUT /api/contributors/:id", () => {
  it("returns 401 without an auth cookie", async () => {
    const contributor = await Contributor.create(validContributor);
    const res = await request(app)
      .put(`/api/contributors/${contributor._id}`)
      .send(validContributor);

    expect(res.status).toBe(401);
  });

  it("returns 400 for a malformed ObjectId", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .put("/api/contributors/not-an-id")
      .set("Cookie", cookie)
      .send(validContributor);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid ID");
  });

  it("returns 404 when the contributor does not exist", async () => {
    const cookie = await getAuthCookie();
    const fakeId = "000000000000000000000000";
    const res = await request(app)
      .put(`/api/contributors/${fakeId}`)
      .set("Cookie", cookie)
      .send(validContributor);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Contributor not found");
  });

  it("updates and returns the modified contributor", async () => {
    const cookie = await getAuthCookie();
    const contributor = await Contributor.create(validContributor);

    const res = await request(app)
      .put(`/api/contributors/${contributor._id}`)
      .set("Cookie", cookie)
      .send({ ...validContributor, role: "Senior Researcher" });

    expect(res.status).toBe(200);
    expect(res.body.role).toBe("Senior Researcher");
  });
});

// ── DELETE /api/contributors/:id ─────────────────────────────────────────────

describe("DELETE /api/contributors/:id", () => {
  it("returns 401 without an auth cookie", async () => {
    const contributor = await Contributor.create(validContributor);
    const res = await request(app).delete(`/api/contributors/${contributor._id}`);

    expect(res.status).toBe(401);
  });

  it("returns 400 for a malformed ObjectId", async () => {
    const cookie = await getAuthCookie();
    const res = await request(app)
      .delete("/api/contributors/not-an-id")
      .set("Cookie", cookie);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid ID");
  });

  it("returns 404 when the contributor does not exist", async () => {
    const cookie = await getAuthCookie();
    const fakeId = "000000000000000000000000";
    const res = await request(app)
      .delete(`/api/contributors/${fakeId}`)
      .set("Cookie", cookie);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Contributor not found");
  });

  it("deletes the contributor and returns a success message", async () => {
    const cookie = await getAuthCookie();
    const contributor = await Contributor.create(validContributor);

    const res = await request(app)
      .delete(`/api/contributors/${contributor._id}`)
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Contributor deleted");

    const found = await Contributor.findById(contributor._id);
    expect(found).toBeNull();
  });
});
