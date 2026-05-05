const Book = require("../models/book.model");

const findAll = () => Book.find();
const findById = (id) => Book.findById(id);
const findByTitle = (title) => Book.findOne({ title });
const create = (data) => Book.create(data);
const update = (id, data) =>
  Book.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
const remove = (id) => Book.findByIdAndDelete(id);

module.exports = { findAll, findById, findByTitle, create, update, remove };
