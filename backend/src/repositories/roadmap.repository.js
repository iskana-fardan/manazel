const Roadmap = require("../models/roadmap.model");

const findAll = () => Roadmap.find();
const findByFieldId = (fieldId) => Roadmap.findOne({ field: fieldId });
const create = (data) => Roadmap.create(data);
const save = (roadmap) => roadmap.save();

module.exports = { findAll, findByFieldId, create, save };
