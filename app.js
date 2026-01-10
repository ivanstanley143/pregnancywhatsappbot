require("dotenv").config();
const express = require("express");

const connectDB = require("./db");
const { connectToWhatsApp } = require("./whatsapp");
const { processReminders } = require("./services/reminderEngine");
const seedReminders = require("./services/reminderSeeder");

const app = express();
const PORT = process.env.PORT || 3000;

// 🌐 Health check (important for servers)
app.get("/", (req, res) => {
  res.send("Pregnancy WhatsApp Bot is running ✅");
});

// 🗄️ Connect MongoDB
connectDB();

// 📱 Connect WhatsApp
connectToWhatsApp();

// 🌱 DAILY SEEDING LOGIC (water + meals every day)
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

// Run once on startup
dailySeed();

// Check every hour (safe for VPS)
setInterval(dailySeed, 60 * 60 * 1000);

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

setInterval(safeProcessReminders, 60 * 1000);

// 🚀 Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
