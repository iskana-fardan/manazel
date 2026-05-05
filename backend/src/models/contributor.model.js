const mongoose = require("mongoose");

const contributorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    avatar: { type: String, trim: true },
    socials: {
      github: String,
      instagram: String,
      website: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Contributor", contributorSchema);
