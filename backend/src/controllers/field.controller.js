const { Field, validate } = require("../models/field.model");
const mongoose = require("mongoose");

exports.getFields = async (req, res) => {
  const fields = await Field.find();
  if (!fields || fields.length === 0) {
    return res.status(404).send("No fields found");
  }

  res.status(200).send(fields);
};

exports.createField = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { slug, name, nameArabic, description, icon, order } = req.body;

  let field = await Field.findOne({ slug });
  if (field) return res.status(400).send("Field already exists");

  field = new Field({
    slug,
    name,
    nameArabic,
    description,
    icon,
    order,
  });

  await field.save();

  res.send(field);
};

exports.deleteField = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const deleted = await Field.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(404).json({ message: "Field not found" });
  }

  res.json({ message: "Field deleted" });
};

exports.updateField = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  //  validasi body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { slug, name, nameArabic, description, icon, order } = req.body;

  // cek duplicate slug kalau slug berubah
  const existingField = await Field.findOne({ slug, _id: { $ne: id } });
  if (existingField)
    return res.status(400).json({ message: "Slug already exists" });

  // update
  const updated = await Field.findByIdAndUpdate(
    id,
    { slug, name, nameArabic, description, icon, order },
    { new: true }, // return document after update
  );

  if (!updated) {
    return res.status(404).json({ message: "Field not found" });
  }

  res.json(updated);
};
