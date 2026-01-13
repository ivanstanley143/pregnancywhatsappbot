const Reminder = require("../models/Reminder");
const { sendTemplate } = require("../whatsappCloud");
const data = require("../data");

async function processAppointmentReminders() {
  const now = new Date();

  const list = await Reminder.find({
    type: "appointment",
    sent: false,
    scheduledAt: { $lte: now }
  });

  for (const r of list) {
    await sendTemplate(data.USER, "pregnancy_appointment", [
      r.data.date,   // {{1}}
      r.data.time,   // {{2}}
      r.data.note    // {{3}}
    ]);

    r.sent = true;
    r.sentAt = new Date();
    await r.save();
  }
}

module.exports = { processAppointmentReminders };
