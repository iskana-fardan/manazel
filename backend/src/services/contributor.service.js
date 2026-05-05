const contributorRepo = require("../repositories/contributor.repository");
const AppError = require("../errors/AppError");

const getAll = () => contributorRepo.findAll();

const create = (data) => contributorRepo.create(data);

const update = async (id, data) => {
  const updated = await contributorRepo.update(id, data);
  if (!updated) throw new AppError("Contributor not found", 404);
  return updated;
};

const remove = async (id) => {
  const deleted = await contributorRepo.remove(id);
  if (!deleted) throw new AppError("Contributor not found", 404);
};

module.exports = { getAll, create, update, remove };
