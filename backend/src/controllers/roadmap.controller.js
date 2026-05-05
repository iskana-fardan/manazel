const { Roadmap } = require("../models/roadmap.model");
const { Field } = require("../models/field.model");

const DEFAULT_LEVELS = [
  { slug: "beginner", label: "Beginner", order: 1 },
  { slug: "intermediate", label: "Intermediate", order: 2 },
  { slug: "advanced", label: "Advanced", order: 3 },
];

const makeDefaultLevels = () => DEFAULT_LEVELS.map((l) => ({ ...l, books: [] }));

async function findRoadmapBySlug(fieldSlug) {
  const field = await Field.findOne({ slug: fieldSlug });
  if (!field) return null;
  return Roadmap.findOne({ field: field._id });
}

exports.getAllRoadmaps = async (req, res) => {
  const roadmaps = await Roadmap.find();
  res.status(200).json(roadmaps);
};

exports.getRoadmapByField = async (req, res) => {
  const roadmap = await findRoadmapBySlug(req.params.fieldSlug);
  if (!roadmap) return res.status(404).json({ message: "No roadmap found" });
  res.status(200).json(roadmap);
};

exports.createRoadmap = async (req, res) => {
  const field = await Field.findOne({ slug: req.params.fieldSlug });
  if (!field) return res.status(404).json({ message: "Field not found" });

  const existing = await Roadmap.findOne({ field: field._id });
  if (existing) return res.status(400).json({ message: "Roadmap already exists for this field" });

  const roadmap = new Roadmap({
    field: field._id,
    title: field.name,
    levels: makeDefaultLevels(),
    muthalaah: makeDefaultLevels(),
  });

  await roadmap.save();
  res.status(201).json(roadmap);
};

exports.addBookToSection = async (req, res) => {
  const { fieldSlug, section, levelSlug } = req.params;
  const { bookId } = req.body;

  const roadmap = await findRoadmapBySlug(fieldSlug);
  if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });

  const sectionArray = section === "dars" ? roadmap.levels : roadmap.muthalaah;
  const level = sectionArray.find((l) => l.slug === levelSlug);
  if (!level) return res.status(404).json({ message: "Level not found" });

  if (level.books.some((b) => b.toString() === bookId)) {
    return res.status(400).json({ message: "Book already in this level" });
  }

  level.books.push(bookId);
  await roadmap.save();
  res.status(200).json(roadmap);
};

exports.removeBookFromSection = async (req, res) => {
  const { fieldSlug, section, levelSlug, bookId } = req.params;

  const roadmap = await findRoadmapBySlug(fieldSlug);
  if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });

  const sectionArray = section === "dars" ? roadmap.levels : roadmap.muthalaah;
  const level = sectionArray.find((l) => l.slug === levelSlug);
  if (!level) return res.status(404).json({ message: "Level not found" });

  level.books = level.books.filter((b) => b.toString() !== bookId);
  await roadmap.save();
  res.status(200).json(roadmap);
};
