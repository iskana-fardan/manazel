const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");
const adminRepo = require("../repositories/admin.repository");
const AppError = require("../errors/AppError");

const login = async ({ email, password }) => {
  const admin = await adminRepo.findByEmail(email);
  if (!admin) throw new AppError("Invalid credentials", 400);

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new AppError("Invalid credentials", 400);

  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn },
  );

  return {
    token,
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  };
};

const getMe = async (adminId) => {
  const admin = await adminRepo.findById(adminId);
  if (!admin) throw new AppError("Admin not found", 404);
  return admin;
};

module.exports = { login, getMe };
