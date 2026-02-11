const { Roadmap, validate } = require("../models/roadmap.model");

exports.getRoadmapByField = async (req, res) => {
  const field = req.params.fieldSlug;
  const roadmap = await Roadmap.find({ field });
  if (!roadmap || roadmap.length === 0) {
    return res.status(404).send("No roadmap found");
  }

  res.status(200).send(roadmap);
};
