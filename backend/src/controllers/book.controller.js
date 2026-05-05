const mongoose = require("mongoose");
const { Book, validate } = require("../models/book.model");

exports.getBooks = async (req, res) => {
  const books = await Book.find();
  res.status(200).json(books);
};

exports.createBook = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const existing = await Book.findOne({ title: req.body.title });
  if (existing) return res.status(400).json({ message: "Book already exists" });

  const book = new Book(req.body);
  await book.save();
  res.status(201).json(book);
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const deleted = await Book.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: "Book not found" });

  res.json({ message: "Book deleted" });
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const { error } = validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const updated = await Book.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
  if (!updated) return res.status(404).json({ message: "Book not found" });

  res.status(200).json(updated);
};
