const { Field, validate } = require("../models/field.model");

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
  try {
    const { id } = req.params;

    const deleted = await Field.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Field not found" });
    }

    res.json({ message: "Field deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
