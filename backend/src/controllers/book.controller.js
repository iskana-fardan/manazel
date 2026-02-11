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
