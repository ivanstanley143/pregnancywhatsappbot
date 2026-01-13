const Reminder = require("../models/Reminder");
const { sendTemplate } = require("../whatsappCloud");

async function processDailyReminders() {
  const list = await Reminder.find({
    sent: false,
    scheduledAt: { $lte: new Date() }
  });

  for (const r of list) {
    await sendTemplate(r.user, "water_reminder");
    r.sent = true;
    await r.save();
  }
}

module.exports = { processDailyReminders };

