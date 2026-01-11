require("dotenv").config();
const express = require("express");
const cron = require("node-cron");

const connectDB = require("./db");
const logic = require("./logic");
const { sendTextMessage, sendImageMessage } = require("./whatsappCloud");

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
   META WEBHOOK VERIFY
========================= */
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("✅ Webhook verified by Meta");
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

/* =========================
   META WEBHOOK RECEIVE
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
      await sendTextMessage(from, reply);
    } else if (reply.type === "image") {
      await sendImageMessage(from, reply.image, reply.caption);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(200);
  }
});

/* =========================
   START EXPRESS SERVER FIRST
   (CRITICAL FIX)
========================= */

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Express is now listening on port", PORT);
});

/* =========================
   BACKGROUND JOBS & DB
========================= */

(async () => {
  try {
    await connectDB();
    await seedDailyReminders();

    // ⏰ Run every minute
    setInterval(processDailyReminders, 60 * 1000);
    setInterval(processAppointmentReminders, 60 * 1000);

    // 📅 Weekly & scheduled jobs
    cron.schedule("0 9 * * 1", sendWeeklyUpdate);         // Monday 9am
    cron.schedule("0 10 * * *", processBabyGrowth);      // Daily 10am
    cron.schedule("0 11 * * *", processTrimesterChange); // Daily 11am
    cron.schedule("0 9 * * 5", sendWeeklyDua);           // Friday 9am

    // Daily dua
    if (process.env.DAILY_DUA_TIME) {
      const [duaHour, duaMinute] = process.env.DAILY_DUA_TIME.split(":");
      cron.schedule(`${duaMinute} ${duaHour} * * *`, sendDailyDua);
    }

  } catch (err) {
    console.error("Startup error:", err);
  }
})();
