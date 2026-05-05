const roadmapService = require("../services/roadmap.service");
const { success } = require("../utils/response");

exports.list = async (req, res) => {
  const roadmaps = await roadmapService.getAll();
  res.json(success(roadmaps, null, { count: roadmaps.length }));
};

exports.getByField = async (req, res) => {
  const roadmap = await roadmapService.getRoadmapByFieldSlug(req.params.fieldSlug);
  res.json(success(roadmap));
};

exports.create = async (req, res) => {
  const roadmap = await roadmapService.createRoadmap(req.params.fieldSlug);
  res.status(201).json(success(roadmap, "Roadmap created"));
};

exports.addBook = async (req, res) => {
  const { fieldSlug, section, levelSlug } = req.params;
  const { bookId } = req.body;
  const roadmap = await roadmapService.addBookToSection(fieldSlug, section, levelSlug, bookId);
  res.json(success(roadmap, "Book added"));
};

exports.removeBook = async (req, res) => {
  const { fieldSlug, section, levelSlug, bookId } = req.params;
  const roadmap = await roadmapService.removeBookFromSection(fieldSlug, section, levelSlug, bookId);
  res.json(success(roadmap, "Book removed"));
};
