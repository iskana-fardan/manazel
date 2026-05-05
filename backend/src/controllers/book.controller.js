const bookService = require("../services/book.service");
const { success } = require("../utils/response");

exports.list = async (req, res) => {
  const books = await bookService.getAll();
  res.json(success(books, null, { count: books.length }));
};

exports.create = async (req, res) => {
  const book = await bookService.create(req.body);
  res.status(201).json(success(book, "Book created"));
};

exports.update = async (req, res) => {
  const book = await bookService.update(req.params.id, req.body);
  res.json(success(book, "Book updated"));
};

exports.remove = async (req, res) => {
  await bookService.remove(req.params.id);
  res.json(success(null, "Book deleted"));
};
