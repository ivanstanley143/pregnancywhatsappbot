require("dotenv").config();
const express = require("express");
const connectDB = require("./db");

const { sendTemplate } = require("./whatsappCloud");
const logic = require("./logic");

// background engines (auto running via cron)
require("./services/dailyEngine");
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

    const result = await logic(text);
    if (!result) {
      return res.sendStatus(200);
    }

    const templatesAllowed = process.env.ALLOW_SEND === "true";

    /* --------------------------------
       TEMPLATE RESPONSES
       (safe / avoid / limit foods etc.)
    --------------------------------- */
    if (result.type === "template" && templatesAllowed) {
      await sendTemplate(from, result.template, [
        {
          type: "body",
          parameters: [
            { type: "text", text: result.params[0] }
          ]
        }
      ]);
    }

    /* --------------------------------
       FALLBACK TEXT RESPONSE
       (while templates are in review)
    --------------------------------- */
    else {
      await sendTemplate(from, "pregnancy_dua", [
        process.env.NAME || "Murshida Sulthana",
        result.text || result.params?.[0]
      ]);
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
