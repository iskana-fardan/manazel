require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin.model");

async function seedAdmin() {
  const { MONGO_URI, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } = process.env;

  if (!MONGO_URI || !SEED_ADMIN_EMAIL || !SEED_ADMIN_PASSWORD) {
    console.error("MONGO_URI, SEED_ADMIN_EMAIL, and SEED_ADMIN_PASSWORD must be set");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);

  const existing = await Admin.findOne({ email: SEED_ADMIN_EMAIL });
  if (existing) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const password = await bcrypt.hash(SEED_ADMIN_PASSWORD, 10);
  await Admin.create({ name: "Super Admin", email: SEED_ADMIN_EMAIL, password, role: "admin" });

  console.log("Admin seeded successfully!");
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
