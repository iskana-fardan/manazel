const mongoose = require("mongoose");
const Joi = require("joi");

const levelSchema = new mongoose.Schema({
  slug: String,
  label: String,
  order: Number,
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

const roadmapSchema = new mongoose.Schema(
  {
    field: { type: mongoose.Schema.Types.ObjectId, ref: "Field" },
    title: String,
    titleArabic: String,
    description: String,
    icon: String,
    levels: [levelSchema],
    muthalaah: [levelSchema],
  },
  { timestamps: true },
);

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

function validateRoadmap(roadmap) {
  const levelItemSchema = Joi.object({
    slug: Joi.string().required(),
    label: Joi.string().min(3).max(100).required(),
    order: Joi.number().integer().required(),
    books: Joi.array().items(Joi.string().pattern(/^[a-f\d]{24}$/i)).optional(),
  });

  const schema = Joi.object({
    field: Joi.string().required(),
    title: Joi.string().min(3).max(255).required(),
    titleArabic: Joi.string().min(3).max(255).optional(),
    description: Joi.string().max(500).optional(),
    icon: Joi.string().uri().optional(),
    levels: Joi.array().items(levelItemSchema).optional(),
    muthalaah: Joi.array().items(levelItemSchema).optional(),
  });

  return schema.validate(roadmap);
}

exports.Roadmap = Roadmap;
exports.validate = validateRoadmap;
