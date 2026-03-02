const mongoose = require("mongoose");
const { Contributor, validate } = require("../models/contributor.model");

exports.getContributors = async (req, res) => {
  const contributors = await Contributor.find();
  res.status(200).send(contributors);
};

exports.createContributor = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const {
    name,
    role,
    description,
    avatar,
    socials: { github, instagram, website },
  } = req.body;

  let contributor = new Contributor({
    name,
    role,
    description,
    avatar,
    socials: {
      github,
      instagram,
      website,
    },
  });

  await contributor.save();

  res.send(contributor);
};

exports.deleteContributor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const deleted = await Contributor.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(404).json({ message: "Contributor not found" });
  }

  res.json({ message: "Contributor deleted" });
};

exports.updateContributor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const {
    name,
    role,
    description,
    avatar,
    socials: { github, instagram, website },
  } = req.body;

  const updated = await Contributor.findByIdAndUpdate(
    id,
    {
      name,
      role,
      description,
      avatar,
      socials: {
        github,
        instagram,
        website,
      },
    },
    { new: true },
  );

  if (!updated) {
    return res.status(404).json({ message: "Contributor not found" });
  }

  res.status(200).json(updated);
};
