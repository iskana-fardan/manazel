require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin.model");

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await Admin.findOne({
      email: process.env.SEED_ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(
      process.env.SEED_ADMIN_PASSWORD,
      10,
    );

    const admin = new Admin({
      name: "Super Admin",
      email: process.env.SEED_ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    console.log("Admin seeded successfully!");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

seedAdmin();
