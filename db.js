require("dotenv").config();   // ✅ LOAD ENVIRONMENT VARIABLES
const mongoose = require("mongoose");

async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from .env");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("🗄️ MongoDB connected");
}

module.exports = connectDB;

