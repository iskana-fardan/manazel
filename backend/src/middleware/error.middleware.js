module.exports = function (err, req, res, next) {
  console.error(err); // logging

  res.status(500).send("Internal server error");
};
