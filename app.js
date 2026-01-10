require("dotenv").config();
const express = require("express");

const connectDB = require("./db");
const { connectToWhatsApp } = require("./whatsapp");
const { processReminders } = require("./services/reminderEngine");
const seedReminders = require("./services/reminderSeeder");

const app = express();
const PORT = process.env.PORT || 3000;

// 🌐 Health check
app.get("/", (req, res) => {
  res.send("Pregnancy WhatsApp Bot is running ✅");
});

// ⏰ PROCESS REMINDERS (every minute)
let isRunning = false;
async function safeProcessReminders() {
  if (isRunning) return;
  isRunning = true;

  try {
    await processReminders();
  } catch (err) {
    console.error("❌ Reminder engine error:", err.message);
  } finally {
    isRunning = false;
  }
}

// 🌱 DAILY SEEDING LOGIC
let lastSeedDate = null;
async function dailySeed() {
  const today = new Date().toDateString();

  if (lastSeedDate !== today) {
    console.log("🌱 Seeding daily reminders...");
    try {
      await seedReminders();
      lastSeedDate = today;
      console.log("✅ Daily reminders seeded");
    } catch (err) {
      console.error("❌ Seeding failed:", err.message);
    }
  }
}

// 🚀 ORDERED BOOTSTRAP (IMPORTANT)
(async () => {
  // 1️⃣ WhatsApp FIRST (pairing needs clean stdin)
  await connectToWhatsApp();

  // 2️⃣ MongoDB
  await connectDB();

  // 3️⃣ Seed once on startup
  await dailySeed();

  // 4️⃣ Schedulers
  setInterval(dailySeed, 60 * 60 * 1000);   // hourly check
  setInterval(safeProcessReminders, 60 * 1000); // every minute

  // 5️⃣ Start server LAST
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();
