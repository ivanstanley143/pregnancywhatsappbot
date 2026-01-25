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

    const templateMap = {
      12: "pregnancy_week_12",
      13: "pregnancy_week_13",
      14: "pregnancy_week_14_v1",
      15: "pregnancy_week_15",
      16: "pregnancy_week_16",
      17: "pregnancy_week_17_v1",
      18: "pregnancy_week_18",
      19: "pregnancy_week_19",
      20: "pregnancy_week_20"
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
        String(data.NAME),      // {{1}}
        String(baby.size),      // {{2}}
        String(week)            // {{3}}
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
