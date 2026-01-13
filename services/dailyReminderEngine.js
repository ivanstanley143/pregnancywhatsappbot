const Reminder = require("../models/Reminder");
const { sendTemplate } = require("../whatsappCloud");

async function processDailyReminders() {
  const now = new Date();

  const list = await Reminder.find({
    sent: false,
    scheduledAt: { $lte: now }
  });

  for (const r of list) {
    try {
      if (r.type === "water") {
        await sendTemplate(r.user, "pregnancy_water_reminder");
      }

      if (r.type === "meal") {
        await sendTemplate(r.user, "pregnancy_meal_reminder");
      }

      if (r.type === "dua") {
        await sendTemplate(r.user, "pregnancy_dua");
      }

      r.sent = true;
      await r.save();
    } catch (err) {
      console.error("❌ Send failed", err.response?.data || err.message);
    }
  }
}

module.exports = { processDailyReminders };
