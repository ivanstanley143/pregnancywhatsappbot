const cron = require("node-cron");
const Reminder = require("../models/Reminder");
const { sendTemplate } = require("../whatsappCloud");
const data = require("../data");

// ================================
// PROCESS APPOINTMENT REMINDERS
// ================================
async function processAppointmentReminders() {
  try {
    const now = new Date();

    const list = await Reminder.find({
      type: "appointment",
      sent: false,
      scheduledAt: { $lte: now }
    });

    for (const r of list) {
      const date =
        r.data && r.data.date
          ? r.data.date
          : "Scheduled date";

      const time =
        r.data && r.data.time
          ? r.data.time
          : "Scheduled time";

      const note =
        r.data && r.data.note
          ? r.data.note
          : "Doctor visit";

      await sendTemplate(
        data.USER,
        "pregnancy_appointment",
        [
          String(date), // {{1}}
          String(time), // {{2}}
          String(note)  // {{3}}
        ]
      );

      r.sent = true;
      r.sentAt = new Date();
      await r.save();

      console.log(
        "🩺 Appointment reminder sent:",
        date,
        time,
        note
      );
    }
  } catch (err) {
    console.error(
      "❌ Appointment Engine error:",
      err.message
    );
  }
}

// ================================
// RUN EVERY MINUTE
// ================================
cron.schedule("* * * * *", () => {
  processAppointmentReminders();
});

module.exports = {
  processAppointmentReminders
};
