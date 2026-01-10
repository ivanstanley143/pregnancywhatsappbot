const Reminder = require("../models/Reminder");
const utils = require("../utils");
const { sendTextMessage } = require("../whatsappCloud");

async function processDailyReminders() {
  const list = await Reminder.find({ sent: false, scheduledAt: { $lte: new Date() } });

  for (const r of list) {
    await sendTextMessage(r.user, utils.format("💧 Please drink water"));
    r.sent = true;
    await r.save();
  }
}

module.exports = { processDailyReminders };
