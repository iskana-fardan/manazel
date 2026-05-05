const roadmapRepo = require("../repositories/roadmap.repository");
const fieldRepo = require("../repositories/field.repository");
const AppError = require("../errors/AppError");

const VALID_SECTIONS = new Set(["dars", "muthalaah"]);

const DEFAULT_LEVELS = [
  { slug: "beginner", label: "Beginner", order: 1, books: [] },
  { slug: "intermediate", label: "Intermediate", order: 2, books: [] },
  { slug: "advanced", label: "Advanced", order: 3, books: [] },
];

const sectionKey = (section) => (section === "dars" ? "levels" : "muthalaah");

const getAll = () => roadmapRepo.findAll();

const getRoadmapByFieldSlug = async (fieldSlug) => {
  const field = await fieldRepo.findBySlug(fieldSlug);
  if (!field) throw new AppError("Field not found", 404);

  const roadmap = await roadmapRepo.findByFieldId(field._id);
  if (!roadmap) throw new AppError("Roadmap not found", 404);
  return roadmap;
};

const createRoadmap = async (fieldSlug) => {
  const field = await fieldRepo.findBySlug(fieldSlug);
  if (!field) throw new AppError("Field not found", 404);

  const existing = await roadmapRepo.findByFieldId(field._id);
  if (existing) throw new AppError("Roadmap already exists for this field", 400);

  return roadmapRepo.create({
    field: field._id,
    title: field.name,
    levels: DEFAULT_LEVELS.map((l) => ({ ...l })),
    muthalaah: DEFAULT_LEVELS.map((l) => ({ ...l })),
  });
};

const addBookToSection = async (fieldSlug, section, levelSlug, bookId) => {
  if (!VALID_SECTIONS.has(section)) throw new AppError("Invalid section", 400);

  const roadmap = await getRoadmapByFieldSlug(fieldSlug).catch(() => null);
  if (!roadmap) throw new AppError("Roadmap not found", 404);

  const arr = roadmap[sectionKey(section)];
  const level = arr.find((l) => l.slug === levelSlug);
  if (!level) throw new AppError("Level not found", 404);

  if (level.books.some((b) => b.toString() === bookId)) {
    throw new AppError("Book already in this level", 400);
  }

  level.books.push(bookId);
  return roadmapRepo.save(roadmap);
};

const removeBookFromSection = async (fieldSlug, section, levelSlug, bookId) => {
  if (!VALID_SECTIONS.has(section)) throw new AppError("Invalid section", 400);

  const roadmap = await getRoadmapByFieldSlug(fieldSlug).catch(() => null);
  if (!roadmap) throw new AppError("Roadmap not found", 404);

  const arr = roadmap[sectionKey(section)];
  const level = arr.find((l) => l.slug === levelSlug);
  if (!level) throw new AppError("Level not found", 404);

  level.books = level.books.filter((b) => b.toString() !== bookId);
  return roadmapRepo.save(roadmap);
};

module.exports = { getAll, getRoadmapByFieldSlug, createRoadmap, addBookToSection, removeBookFromSection };
