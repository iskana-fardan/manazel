const mongoose = require("mongoose");
const Joi = require("joi");

const contributorSchema = new mongoose.Schema(
  {
    name: String,
    role: String,
    description: String,
    avatar: String,
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
    name: Joi.string().min(3).max(50).required(), // minimal 3 karakter dan maksimal 50 karakter
    role: Joi.string().min(3).max(100).required(), // minimal 3 karakter dan maksimal 100 karakter
    description: Joi.string().max(500), // bisa lebih panjang
    avatar: Joi.string().uri().optional(), // optional, harus valid URL jika ada
    socials: Joi.object({
      github: Joi.string().uri().optional(), // github URL jika ada, harus valid
      instagram: Joi.string().optional(), // instagram, bisa aja URL atau username
      website: Joi.string().uri().optional(), // website URL jika ada
    }).optional(), // socials bisa ada atau nggak
  });

  return schema.validate(contributor);
}

exports.Contributor = Contributor;
exports.validate = validateContributor;
