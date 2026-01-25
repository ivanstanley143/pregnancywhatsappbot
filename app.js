require("dotenv").config();

const express = require("express");
const axios = require("axios");
const connectDB = require("./db");

const { sendTemplate } = require("./whatsappCloud");
const logic = require("./logic");

const app = express();
app.use(express.json());

/* ================================
   CONNECT DB + LOAD CRON ENGINES
================================ */
(async () => {
  try {
    await connectDB(); // ✅ Wait for MongoDB

    console.log("🧠 Loading cron engines...");

    require("./services/cronHealth");
    require("./services/minuteScheduler");
    require("./services/duaEngine");
    require("./services/weeklyEngine");
    require("./services/trimesterEngine");
    require("./services/athaanDailyEngine");
    require("./services/athaanReminderEngine");
    require("./services/appointmentEngine");

    console.log("✅ All cron engines loaded");
  } catch (err) {
    console.error("❌ Failed to init app:", err);
  }
})();

/* ================================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.send("Pregnancy WhatsApp Bot Running");
});

app.get("/health", (req, res) => {
  res.send("OK");
});

/* ================================
   META WEBHOOK VERIFICATION
================================ */
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

/* ================================
   META WHATSAPP WEBHOOK
================================ */
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    // Ignore non-text events
    if (!message || !message.text) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const text = message.text.body.trim();

    console.log("📩 Incoming message:", text);

    const result = await logic(text, from);
    if (!result) return res.sendStatus(200);

    /* TEMPLATE RESPONSE */
    if (result.type === "template") {
      console.log("📤 Sending template:", result.template, result.params || []);

      await sendTemplate(from, result.template, result.params || []);
    }

    /* TEXT RESPONSE */
    if (result.type === "text") {
      console.log("📤 Sending text:", result.text);

      await axios.post(
        `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: { body: result.text }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.META_TOKEN}`,
            "Content-Type": "application/json"
          }
        }
      );
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err.response?.data || err.message);
    res.sendStatus(200);
  }
});

/* ================================
   GLOBAL ERROR HANDLERS (IMPORTANT)
================================ */
process.on("uncaughtException", err => {
  console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", err => {
  console.error("🔥 Unhandled Promise Rejection:", err);
});

/* ================================
   SERVER START
================================ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Pregnancy Bot running on port", PORT);
});
