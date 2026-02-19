const mongoose = require("mongoose");
const Joi = require("joi");

const fieldSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nameArabic: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const Field = mongoose.model("Field", fieldSchema);

function validateField(field) {
  const schema = Joi.object({
    slug: Joi.string().required(),
    name: Joi.string().required(),
    nameArabic: Joi.string().required(),
    description: Joi.string().required(),
    icon: Joi.string().required(),
    order: Joi.number().required(),
  });

  return schema.validate(field);
}

exports.Field = Field;
exports.validate = validateField;
