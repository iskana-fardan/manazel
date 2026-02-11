const mongoose = require("mongoose");
const Joi = require("joi");

const fieldSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    nameArabic: String,
    description: String,
    icon: String,
    order: Number,
  },
  { timestamps: true }, // MongoDB otomatis nambahin metadata waktu ke tiap dokumen
);

const Field = mongoose.model("Field", fieldSchema);

// validate field
function validateField(field) {
  const schema = Joi.object({
    slug: Joi.string().required(),
    name: Joi.string(),
    nameArabic: Joi.string(),
    description: Joi.string(),
    icon: Joi.string(),
    order: Joi.number(),
  });
  return schema.validate(field);
}

exports.Field = Field;
exports.validate = validateField;
