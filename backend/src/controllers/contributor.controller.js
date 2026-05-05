const contributorService = require("../services/contributor.service");
const { success } = require("../utils/response");

exports.list = async (req, res) => {
  const contributors = await contributorService.getAll();
  res.json(success(contributors, null, { count: contributors.length }));
};

exports.create = async (req, res) => {
  const contributor = await contributorService.create(req.body);
  res.status(201).json(success(contributor, "Contributor created"));
};

exports.update = async (req, res) => {
  const contributor = await contributorService.update(req.params.id, req.body);
  res.json(success(contributor, "Contributor updated"));
};

exports.remove = async (req, res) => {
  await contributorService.remove(req.params.id);
  res.json(success(null, "Contributor deleted"));
};
