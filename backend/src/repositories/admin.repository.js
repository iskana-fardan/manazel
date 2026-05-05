const Admin = require("../models/admin.model");

const findByEmail = (email) => Admin.findOne({ email });
const findById = (id) => Admin.findById(id).select("-password");

module.exports = { findByEmail, findById };
