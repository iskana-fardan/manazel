const Contributor = require("../models/contributor.model");

const findAll = () => Contributor.find();
const findById = (id) => Contributor.findById(id);
const create = (data) => Contributor.create(data);
const update = (id, data) =>
  Contributor.findByIdAndUpdate(id, data, { new: true });
const remove = (id) => Contributor.findByIdAndDelete(id);

module.exports = { findAll, findById, create, update, remove };
