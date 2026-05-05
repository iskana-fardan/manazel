const fieldRepo = require("../repositories/field.repository");
const AppError = require("../errors/AppError");

const getAll = () => fieldRepo.findAll();

const create = async (data) => {
  const existing = await fieldRepo.findBySlug(data.slug);
  if (existing) throw new AppError("Field already exists", 400);
  return fieldRepo.create(data);
};

const update = async (id, data) => {
  const slugTaken = await fieldRepo.findBySlugExcluding(data.slug, id);
  if (slugTaken) throw new AppError("Slug already exists", 400);

  const updated = await fieldRepo.update(id, data);
  if (!updated) throw new AppError("Field not found", 404);
  return updated;
};

const remove = async (id) => {
  const deleted = await fieldRepo.remove(id);
  if (!deleted) throw new AppError("Field not found", 404);
};

module.exports = { getAll, create, update, remove };
