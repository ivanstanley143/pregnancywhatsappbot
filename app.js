require("dotenv").config();
const express = require("express");
const axios = require("axios");
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

    if (!message || !message.text
