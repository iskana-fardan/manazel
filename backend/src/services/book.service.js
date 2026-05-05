const bookRepo = require("../repositories/book.repository");
const AppError = require("../errors/AppError");

const getAll = () => bookRepo.findAll();

const create = async (data) => {
  const existing = await bookRepo.findByTitle(data.title);
  if (existing) throw new AppError("Book already exists", 400);
  return bookRepo.create(data);
};

const update = async (id, data) => {
  const updated = await bookRepo.update(id, data);
  if (!updated) throw new AppError("Book not found", 404);
  return updated;
};

const remove = async (id) => {
  const deleted = await bookRepo.remove(id);
  if (!deleted) throw new AppError("Book not found", 404);
};

module.exports = { getAll, create, update, remove };
