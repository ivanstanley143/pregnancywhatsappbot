const mongoose = require("mongoose");

async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI missing in .env");
      return;
    }

    console.log("🔌 Connecting to MongoDB...");
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log("🗄️ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:");
    console.error(err.message);
  }
}

module.exports = connectDB;
