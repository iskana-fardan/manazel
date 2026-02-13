module.exports = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

// ===== INI BUAT NANTI ======
