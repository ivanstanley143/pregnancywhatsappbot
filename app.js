require("dotenv").config();
process.env.TIMEZONE = "Asia/Kolkata";

const express = require("express");
const connectDB = require("./db"); // ✅ ADD MongoDB connection
const { connectToWhatsApp } = require("./whatsapp");
const { processReminders } = require("./services/reminderEngine");

const app = express();
app.use(express.json());

// 🌐 Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "pregnancywhatsappbot" });
});

// 🔌 CONNECT MONGODB FIRST
connectDB();

// 🚀 Start WhatsApp + Reminder Engine
connectToWhatsApp()
  .then(() => {
    console.log("🤖 Pregnancy WhatsApp Bot started");

    // 🔁 Replay missed reminders
    processReminders();

    // ⏱️ Run every minute
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
