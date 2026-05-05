const mongoose = require("mongoose");

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

module.exports = mongoose.model("Roadmap", roadmapSchema);
