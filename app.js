require("dotenv").config();
const express = require("express");
const cron = require("node-cron");

const connectDB = require("./db");
const logic = require("./logic");
const sendMessage = require("./whatsappCloud");

// Engines
const { seedDailyReminders } = require("./services/dailyReminderSeeder");
const { processDailyReminders } = require("./services/dailyReminderEngine");
const { processAppointmentReminders } = require("./services/appointmentEngine");
const { sendWeeklyUpdate } = require("./services/weeklyEngine");
const { processBabyGrowth } = require("./services/babyGrowthEngine");
const { processTrimesterChange } = require("./services/trimesterEngine");
const { sendWeeklyDua, sendDailyDua } = require("./services/duaEngine");

const app = express();
app.use(express.json());

/* =========================
   WEBHOOK VERIFY (META)
========================= */
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

/* =========================
   WEBHOOK RECEIVE
========================= */
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    const text = message.text?.body;

    if (!text) return res.sendStatus(200);

    const reply = await logic(text);
    if (!reply) return res.sendStatus(200);

    if (typeof reply === "string") {
      await sendMessage(from, reply);
    } else if (reply.type === "image") {
      await sendMessage(from, reply.caption, reply.image);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(200);
  }
});

/* =========================
   START SERVER + CRON
========================= */
(async () => {
  await connectDB();

  // 🌱 Seed once per day
  seedDailyReminders();

  // ⏰ Minute-based processors
  setInterval(processDailyReminders, 60 * 1000);
  setInterval(processAppointmentReminders, 60 * 1000);

  // 📅 Weekly & scheduled jobs
  cron.schedule("0 9 * * 1", sendWeeklyUpdate);
  cron.schedule("0 10 * * *", processBabyGrowth);
  cron.schedule("0 11 * * *", processTrimesterChange);
  cron.schedule("0 9 * * 5", sendWeeklyDua);
  cron.schedule(process.env.DAILY_DUA_TIME + " * * *", sendDailyDua);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`🚀 Pregnancy WhatsApp Bot running on port ${PORT}`)
  );
})();
