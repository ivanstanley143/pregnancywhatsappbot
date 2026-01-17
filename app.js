require("dotenv").config();
const express = require("express");
const axios = require("axios");
const connectDB = require("./db");

const { sendTemplate } = require("./whatsappCloud");
const logic = require("./logic");

// background engines (auto running via cron)
require("./services/minuteScheduler");
require("./services/duaEngine");
require("./services/weeklyEngine");
require("./services/trimesterEngine");
require("./services/appointmentEngine");

const app = express();
app.use(express.json());

connectDB();

/* ================================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.send("Pregnancy WhatsApp Bot Running");
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

    if (!message || !message.text) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const text = message.text.body.trim();

    console.log("📩 Incoming message:", text);

    const result = await logic(text);
    if (!result) {
      return res.sendStatus(200);
    }

    /* --------------------------------
       TEMPLATE RESPONSES
    --------------------------------- */
    if (result.type === "template") {
      console.log(
        "📤 Sending template:",
        result.template,
        result.params
      );

      await sendTemplate(
        from,
        result.template,
        result.params || []
      );
    }

    /* --------------------------------
       TEXT RESPONSES (PLAIN TEXT)
    --------------------------------- */
    if (result.type === "text") {
      console.log("📤 Sending text:", result.text);

      await axios.post(
        `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: {
            body: result.text
          }
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
    console.error(
      "Webhook error:",
      err.response?.data || err.message
    );
    res.sendStatus(200);
  }
});

/* ================================
   SERVER START
================================ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Pregnancy Bot running on port", PORT);
});
