const config = require("../config");
const authService = require("../services/auth.service");
const { success } = require("../utils/response");

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000,
};

exports.login = async (req, res) => {
  const { token, admin } = await authService.login(req.body);
  res.cookie("token", token, { ...COOKIE_OPTIONS, secure: config.isProduction });
  res.json(success({ admin }, "Login successful"));
};

exports.logout = (_req, res) => {
  res.clearCookie("token");
  res.json(success(null, "Logged out successfully"));
};

exports.me = async (req, res) => {
  const admin = await authService.getMe(req.admin.id);
  res.json(success(admin));
};
