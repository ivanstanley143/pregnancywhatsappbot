require("dotenv").config();
const express = require("express");
const cron = require("node-cron");

const connectDB = require("./db");
const logic = require("./logic");
const { sendTemplate } = require("./whatsappCloud");

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

    if (!message || !message.text) return res.sendStatus(200);

    const from = message.from;
    const text = message.text.body.trim();

    const reply = await logic(text);
    if (!reply) return res.sendStatus(200);

    // All text replies go through pregnancy_dua template
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

/* =========================
   START SERVER + CRON
========================= */
(async () => {
  await connectDB();

  console.log("🟢 DB connected");

  // Seed reminders once on startup
  await seedDailyReminders();

  // Run reminder engines every minute
  setInterval(() => {
    processDailyReminders().catch(console.error);
  }, 60000);

  setInterval(() => {
    processAppointmentReminders().catch(console.error);
  }, 60000);

  // Weekly & scheduled jobs
  cron.schedule("0 9 * * 1", () => sendWeeklyUpdate().catch(console.error));     // Monday 9am
  cron.schedule("0 10 * * *", () => processBabyGrowth().catch(console.error));  // Daily 10am
  cron.schedule("0 11 * * *", () => processTrimesterChange().catch(console.error));
  cron.schedule("0 9 * * 5", () => sendWeeklyDua().catch(console.error));        // Friday 9am

  // Daily Dua
  const [duaHour, duaMinute] = process.env.DAILY_DUA_TIME.split(":");
  cron.schedule(`${duaMinute} ${duaHour} * * *`, () => sendDailyDua().catch(console.error));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Pregnancy WhatsApp Bot running on port ${PORT}`);
  });
})();
