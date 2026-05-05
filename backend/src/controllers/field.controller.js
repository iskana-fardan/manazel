const fieldService = require("../services/field.service");
const { success } = require("../utils/response");

exports.list = async (req, res) => {
  const fields = await fieldService.getAll();
  res.json(success(fields, null, { count: fields.length }));
};

exports.create = async (req, res) => {
  const field = await fieldService.create(req.body);
  res.status(201).json(success(field, "Field created"));
};

exports.update = async (req, res) => {
  const field = await fieldService.update(req.params.id, req.body);
  res.json(success(field, "Field updated"));
};

exports.remove = async (req, res) => {
  await fieldService.remove(req.params.id);
  res.json(success(null, "Field deleted"));
};
