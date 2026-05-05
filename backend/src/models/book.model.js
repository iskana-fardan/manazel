const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  label: { type: String, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
});

const editionSchema = new mongoose.Schema({
  publisher: String,
  note: String,
  label: { type: String, required: true },
});

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    titleArabic: String,
    author: { type: String, required: true },
    type: String,
    level: String,
    field: String,
    description: String,
    recommendedUsage: String,
    resources: [resourceSchema],
    recommendedEditions: [editionSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Book", bookSchema);
