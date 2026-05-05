const Field = require("../models/field.model");

const findAll = () => Field.find().sort({ order: 1 });
const findById = (id) => Field.findById(id);
const findBySlug = (slug) => Field.findOne({ slug });
const findBySlugExcluding = (slug, excludeId) =>
  Field.findOne({ slug, _id: { $ne: excludeId } });
const create = (data) => Field.create(data);
const update = (id, data) =>
  Field.findByIdAndUpdate(id, data, { new: true, runValidators: true });
const remove = (id) => Field.findByIdAndDelete(id);

module.exports = { findAll, findById, findBySlug, findBySlugExcluding, create, update, remove };
