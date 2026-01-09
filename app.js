process.env.TIMEZONE = "Asia/Kolkata";
require("dotenv").config();

const express = require("express");
const { connectToWhatsApp } = require("./whatsapp");

const app = express();
app.use(express.json());

// 🌐 Health check (Koyeb / VPS)
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "pregnancywhatsappbot" });
});

// 🚀 Start WhatsApp ONLY (scheduler removed)
connectToWhatsApp()
  .then(() => {
    console.log("🤖 Pregnancy WhatsApp Bot started");
    // ❌ scheduler is intentionally NOT called
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
