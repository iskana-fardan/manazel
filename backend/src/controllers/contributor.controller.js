const { Contributor, validate } = require("../models/contributor.model");

exports.getContributors = async (req, res) => {
  const contributors = await Contributor.find();
  if (!contributors || contributors.length === 0) {
    return res.status(404).send("No contributors found");
  }

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
