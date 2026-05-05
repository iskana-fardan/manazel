const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    nameArabic: { type: String, trim: true },
    description: { type: String, trim: true },
    icon: { type: String, trim: true },
    order: { type: Number, required: true, unique: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Field", fieldSchema);
