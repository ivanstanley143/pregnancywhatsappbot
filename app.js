process.env.TIMEZONE = "Asia/Kolkata";
require("dotenv").config();

const express = require("express");
const { connectToWhatsApp } = require("./whatsapp");
const { processReminders } = require("./services/reminderEngine");
const seedReminders = require("./services/reminderSeeder");

const app = express();
app.use(express.json());

// 🌐 Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "pregnancywhatsappbot" });
});

// 🚀 Start WhatsApp + Reminder System
connectToWhatsApp()
  .then(async () => {
    console.log("🤖 Pregnancy WhatsApp Bot started");

    // 🌱 TEMP: Seed reminders ONCE
    await seedReminders();

    // 🔁 Replay missed reminders immediately
    processReminders();

    // ⏱️ Check reminders every 1 minute
    setInterval(processReminders, 60 * 1000);
  })
  .catch((err) => {
    console.error("❌ Failed to start bot:", err);
    process.exit(1);
  });

// 🌐 HTTP server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 HTTP server running on port ${PORT}`);
});
