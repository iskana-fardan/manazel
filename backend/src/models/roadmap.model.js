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
    muthalaah: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  },
  { timestamps: true },
);

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

function validateRoadmap(roadmap) {
  const schema = Joi.object({
    field: Joi.string().required(),
    title: Joi.string().min(3).max(255).required(),
    titleArabic: Joi.string().min(3).max(255).optional(),
    description: Joi.string().max(500).optional(),
    icon: Joi.string().uri().optional(),
    levels: Joi.array()
      .items(
        Joi.object({
          slug: Joi.string().required(),
          label: Joi.string().min(3).max(100).required(),
          order: Joi.number().integer().required(),
          books: Joi.array().items(Joi.objectId()).optional(),
        }).required(),
      )
      .optional(),
    muthalaah: Joi.array().items(Joi.objectId()).optional(),
  });

  return schema.validate(roadmap);
}

exports.Roadmap = Roadmap;
exports.validate = validateRoadmap;
