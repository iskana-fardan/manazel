const mongoose = require("mongoose");
const Joi = require("joi");

const resourceSchema = new mongoose.Schema({
  label: String,
  type: String,
  url: String,
});

const editionSchema = new mongoose.Schema({
  publisher: String,
  note: String,
  label: String,
});

const bookSchema = new mongoose.Schema(
  {
    title: String,
    titleArabic: String,
    author: String,
    type: String,
    level: String,
    field: { type: String },
    description: String,
    recommendedUsage: String,
    resources: [resourceSchema],
    recommendedEditions: [editionSchema],
  },
  { timestamps: true },
);

const Book = mongoose.model("Book", bookSchema);

// validate book
function validateBook(book) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(), // Title harus string dan wajib ada
    titleArabic: Joi.string().min(3).max(255).optional(), // Opsional dan panjang minimal 3 karakter
    author: Joi.string().min(3).max(255).required(), // Author harus string dan wajib ada
    type: Joi.string().optional(), // Opsional
    level: Joi.string().optional(), // Opsional
    field: Joi.string().optional(), // Opsional
    description: Joi.string().max(500).optional(), // Description bisa lebih panjang
    recommendedUsage: Joi.string().max(500).optional(), // recommendedUsage juga opsional
    resources: Joi.array()
      .items(
        Joi.object({
          label: Joi.string().min(3).max(255).required(), // Label wajib ada dan harus string
          type: Joi.string().min(3).max(100).required(), // Type harus string dan wajib ada
          url: Joi.string().uri().required(), // URL harus valid
        }).required(),
      )
      .optional(), // Resources opsional, tapi jika ada harus sesuai schema
    recommendedEditions: Joi.array()
      .items(
        Joi.object({
          publisher: Joi.string().min(3).max(255).optional(), // Publisher opsional
          note: Joi.string().min(3).max(255).optional(), // Note opsional
          label: Joi.string().min(3).max(255).required(), // Label wajib ada
        }).optional(),
      )
      .optional(), // recommendedEditions opsional, tapi jika ada harus sesuai schema
  });

  return schema.validate(book);
}

exports.Book = Book;
exports.validate = validateBook;
