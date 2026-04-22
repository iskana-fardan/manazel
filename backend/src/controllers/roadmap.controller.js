const { Roadmap } = require("../models/roadmap.model");
const { Field } = require("../models/field.model");

const DEFAULT_LEVELS = [
  { slug: "beginner", label: "Beginner", order: 1, books: [] },
  { slug: "intermediate", label: "Intermediate", order: 2, books: [] },
  { slug: "advanced", label: "Advanced", order: 3, books: [] },
];

async function findRoadmapBySlug(fieldSlug) {
  const field = await Field.findOne({ slug: fieldSlug });
  if (!field) return null;
  return Roadmap.findOne({ field: field._id });
}

exports.getAllRoadmaps = async (req, res) => {
  const roadmaps = await Roadmap.find();
  res.status(200).send(roadmaps);
};

exports.getRoadmapByField = async (req, res) => {
  const roadmap = await findRoadmapBySlug(req.params.fieldSlug);
  if (!roadmap) return res.status(404).send("No roadmap found");
  res.status(200).send(roadmap);
};

exports.createRoadmap = async (req, res) => {
  const field = await Field.findOne({ slug: req.params.fieldSlug });
  if (!field) return res.status(404).send("Field not found");

  const existing = await Roadmap.findOne({ field: field._id });
  if (existing) return res.status(400).send("Roadmap already exists for this field");

  const roadmap = new Roadmap({
    field: field._id,
    title: field.name,
    levels: DEFAULT_LEVELS,
    muthalaah: DEFAULT_LEVELS,
  });

  await roadmap.save();
  res.status(201).send(roadmap);
};

exports.addBookToSection = async (req, res) => {
  const { fieldSlug, section, levelSlug } = req.params;
  const { bookId } = req.body;

  const roadmap = await findRoadmapBySlug(fieldSlug);
  if (!roadmap) return res.status(404).send("Roadmap not found");

  const sectionArray = section === "dars" ? roadmap.levels : roadmap.muthalaah;
  const level = sectionArray.find((l) => l.slug === levelSlug);
  if (!level) return res.status(404).send("Level not found");

  if (level.books.some((b) => b.toString() === bookId)) {
    return res.status(400).send("Book already in this level");
  }

  level.books.push(bookId);
  await roadmap.save();
  res.status(200).send(roadmap);
};

exports.removeBookFromSection = async (req, res) => {
  const { fieldSlug, section, levelSlug, bookId } = req.params;

  const roadmap = await findRoadmapBySlug(fieldSlug);
  if (!roadmap) return res.status(404).send("Roadmap not found");

  const sectionArray = section === "dars" ? roadmap.levels : roadmap.muthalaah;
  const level = sectionArray.find((l) => l.slug === levelSlug);
  if (!level) return res.status(404).send("Level not found");

  level.books = level.books.filter((b) => b.toString() !== bookId);
  await roadmap.save();
  res.status(200).send(roadmap);
};
