const { default: mongoose } = require("mongoose");
const { Book, validate } = require("../models/book.model");

exports.getBooks = async (req, res) => {
  const books = await Book.find();
  if (!books || books.length === 0) {
    return res.status(404).send("No books found");
  }

  res.status(200).send(books);
};

exports.createBook = async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const {
    title,
    titleArabic,
    author,
    type,
    level,
    field,
    description,
    recommendedUsage,
    resources,
    recommendedEditions,
  } = req.body;

  let book = await Book.findOne({ title });
  if (book) {
    return res.status(400).send("Book already exists");
  }

  book = new Book({
    title,
    titleArabic,
    author,
    type,
    level,
    field,
    description,
    recommendedUsage,
    resources,
    recommendedEditions,
  });

  try {
    await book.save();
    res.status(201).send(book);
  } catch (err) {
    res.status(500).send("Error saving book");
  }
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const deleted = await Book.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.json({ message: "Book deleted" });
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const { error } = validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        new: true, // return updated doc
        runValidators: true, // jalankan mongoose validator
      },
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: "Error updating book" });
  }
};
