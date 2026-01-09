const mongoose = require("mongoose");

async function connectDB() {
  console.log("🔌 Trying to connect MongoDB...");

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🗄️ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
