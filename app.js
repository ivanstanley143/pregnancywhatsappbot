require("dotenv").config();
const express = require("express");
const cron = require("node-cron");
const connectDB = require("./db");

const { sendTemplate } = require("./whatsappCloud");
const logic = require("./logic");

// background engines
require("./services/dailyEngine");
require("./services/duaEngine");
require("./services/weeklyEngine");
require("./services/trimesterEngine");

const app = express();
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Pregnancy WhatsApp Bot Running");
});

/* ================================
   META WHATSAPP WEBHOOK
================================ */
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message || !message.text) return res.sendStatus(200);

    const from = message.from;
    const text = message.text.body.trim();

    // run command router (dua, week, foods, etc)
    const reply = await logic(text);
    if (!reply) return res.sendStatus(200);

    // send as WhatsApp template
    await sendTemplate(from, "pregnancy_dua", [
      "Murshida Sulthana",
      reply
    ]);

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err.response?.data || err.message);
    res.sendStatus(200);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Pregnancy Bot running on port", PORT);
});
