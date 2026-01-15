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
    // SAFETY + ORDER FIX
    const doctorOrType =
      r.data?.doctor ||
      r.data?.type ||
      "Doctor Appointment";

    const date =
      r.data?.date ||
      "Scheduled date";

    const timeOrNote =
      r.data?.time ||
      r.data?.note ||
      "Please be on time";

    await sendTemplate(
      data.USER,
      "pregnancy_appointment",
      [
        String(doctorOrType), // {{1}}
        String(date),         // {{2}}
        String(timeOrNote)    // {{3}}
      ]
    );

    r.sent = true;
    r.sentAt = new Date();
    await r.save();
  }
}

module.exports = { processAppointmentReminders };
