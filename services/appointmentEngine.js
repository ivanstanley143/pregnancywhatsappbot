const Reminder = require("../models/Reminder");
const data = require("../data");
const utils = require("../utils");
const { sendTextMessage } = require("../whatsappCloud");

async function processAppointmentReminders() {
  const now = new Date();
  const list = await Reminder.find({ type: "appointment", sent: false, scheduledAt: { $lte: now } });

  for (const r of list) {
    await sendTextMessage(r.user, utils.format(`📅 Appointment: ${r.data.note}`));
    r.sent = true;
    await r.save();
  }
}

module.exports = { processAppointmentReminders };
