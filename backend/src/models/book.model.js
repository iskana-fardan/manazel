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
    title: Joi.string().min(3).max(255).required(),
    titleArabic: Joi.string().min(3).max(255).optional(),
    author: Joi.string().min(3).max(255).required(),
    type: Joi.string().optional(),
    level: Joi.string().optional(),
    field: Joi.string().optional(),
    description: Joi.string().max(500).optional(),
    recommendedUsage: Joi.string().max(500).optional(),
    resources: Joi.array()
      .items(
        Joi.object({
          label: Joi.string().min(3).max(255).required(),
          type: Joi.string().min(3).max(100).required(),
          url: Joi.string().uri().required(),
        }).required(),
      )
      .optional(),
    recommendedEditions: Joi.array()
      .items(
        Joi.object({
          publisher: Joi.string().min(3).max(255).optional(),
          note: Joi.string().min(3).max(255).optional(),
          label: Joi.string().min(3).max(255).required(),
        }).optional(),
      )
      .optional(),
  });

  return schema.validate(book);
}

exports.Book = Book;
exports.validate = validateBook;
