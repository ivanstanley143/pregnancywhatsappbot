require("dotenv").config();
const express = require("express");
const { connectToWhatsApp } = require("./whatsapp");
const scheduler = require("./scheduler");

const app = express();
app.use(express.json());

// 🌐 Koyeb health check
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "pregnancywhatsappbot" });
});

// 🚀 Start WhatsApp + Scheduler
connectToWhatsApp()
  .then(() => {
    console.log("🤖 Pregnancy WhatsApp Bot started");
    scheduler();
  })
  .catch((err) => {
    console.error("❌ Failed to start bot:", err);
    process.exit(1);
  });

// 🌐 HTTP server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 HTTP server running on port ${PORT}`);
});
