const mongoose = require("mongoose");
const Joi = require("joi");

const contributorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
      trim: true,
    },
    socials: {
      github: String,
      instagram: String,
      website: String,
    },
  },
  { timestamps: true },
);

const Contributor = mongoose.model("Contributor", contributorSchema);

// validate contributor
function validateContributor(contributor) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    role: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500),
    avatar: Joi.string().uri().optional(),
    socials: Joi.object({
      github: Joi.string().uri().optional(),
      instagram: Joi.string().optional(),
      website: Joi.string().uri().optional(),
    }).optional(),
  });

  return schema.validate(contributor);
}

exports.Contributor = Contributor;
exports.validate = validateContributor;
