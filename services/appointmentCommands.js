const Reminder = require("../models/Reminder");
const data = require("../data");

async function handleAppointmentCommand(text) {
  const p = text.split(" ");
  if (p[0] !== "add") return null;

  await Reminder.create({
    user: data.USER,
    type: "appointment",
    scheduledAt: new Date(`${p[1]} ${p[2]}`),
    data: { note: p.slice(3).join(" ") }
  });

  return "✅ Appointment added\nFollow Ziyadka's Advice 🌸";
}

module.exports = { handleAppointmentCommand };
