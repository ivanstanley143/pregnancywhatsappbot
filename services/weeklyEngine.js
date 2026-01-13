const cron = require("node-cron");
const Reminder = require("../models/Reminder");
const data = require("../data");
const { sendTemplate } = require("../whatsappCloud");

/* ===============================
   Pregnancy Week Calculator
================================ */
function getPregnancyWeek() {
  const diff =
    (new Date() - new Date(data.LMP)) / (1000 * 60 * 60 * 24);
  return Math.floor(diff / 7) + 1;
}

/* ===============================
   Send Weekly Baby Update
================================ */
async function sendWeeklyUpdate(to = data.USER) {
  try {
    const week = getPregnancyWeek();
    const baby = data.BABY_IMAGES[week];
    if (!baby) return;

    const exists = await Reminder.findOne({
      user: to,
      type: "week",
      "data.week": week
    });
    if (exists) return;

    const templateName = `pregnancy_week_${week}`;

    await sendTemplate(to, templateName, [
      data.NAME,
      baby.size,
      String(week)
    ]);

    await Reminder.create({
      user: to,
      type: "week",
      data: { week },
      sent: true
    });

    console.log("📅 Week", week, "baby update sent");
  } catch (err) {
    console.error("Weekly Engine Error:", err.message);
  }
}

/* ===============================
   Run Every Morning 10AM
================================ */
cron.schedule("0 10 * * *", sendWeeklyUpdate);

module.exports = {
  getPregnancyWeek,
  sendWeeklyUpdate
};
