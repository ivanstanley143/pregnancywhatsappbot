const cron = require("node-cron");
const Reminder = require("../models/Reminder");
const data = require("../data");
const { sendTemplate } = require("../whatsappCloud");

function getPregnancyWeek() {
  const diff =
    (new Date() - new Date(data.LMP)) / (1000 * 60 * 60 * 24);
  return Math.floor(diff / 7) + 1;
}

async function processWeeklyGrowth() {
  try {
    const week = getPregnancyWeek();
    const baby = data.BABY_IMAGES[week];
    if (!baby) return;

    // Only weeks that exist in Meta
    const templateMap = {
      12: "pregnancy_week_12",
      13: "pregnancy_week_13",
      14: "pregnancy_week_14_v1",
      15: "pregnancy_week_15"
    };

    const templateName = templateMap[week];
    if (!templateName) return;

    const exists = await Reminder.findOne({
      user: data.USER,
      type: "week",
      "data.week": week
    });
    if (exists) return;

    await sendTemplate(
      data.USER,
      templateName,
      [
        String(data.NAME || "Mother"),              // {{1}} Name
        String(baby.size || "Growing beautifully"), // {{2}} Baby size
        String(week)                                // {{3}} Week number
      ]
    );

    await Reminder.create({
      user: data.USER,
      type: "week",
      data: { week },
      sent: true
    });

    console.log("👶 Week", week, "growth sent");
  } catch (err) {
    console.error("Weekly Engine error:", err.message);
  }
}

cron.schedule("0 10 * * *", processWeeklyGrowth);

module.exports = { processWeeklyGrowth };
