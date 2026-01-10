const Reminder = require("./models/Reminder");
const data = require("./data");
const moment = require("moment-timezone");

async function seedDailyReminders() {
  await Reminder.deleteMany({ type: { $in: ["water", "meal"] } });

  const tz = process.env.TIMEZONE || "Asia/Kolkata";

  // WATER reminders
  for (const t of data.WATER_TIMES) {
    const [hour, minute] = t.split(":");

    const time = moment()
      .tz(tz)
      .hour(parseInt(hour))
      .minute(parseInt(minute))
      .second(0);

    if (time.isBefore(moment().tz(tz))) {
      time.add(1, "day");
    }

    await Reminder.create({
      type: "water",
      scheduledAt: time.toDate()
    });
  }

  // MEAL reminders
  for (const timeKey of Object.keys(data.MEALS)) {
    const [hour, minute] = timeKey.split(":");

    const time = moment()
      .tz(tz)
      .hour(parseInt(hour))
      .minute(parseInt(minute))
      .second(0);

    if (time.isBefore(moment().tz(tz))) {
      time.add(1, "day");
    }

    await Reminder.create({
      type: "meal",
      scheduledAt: time.toDate(),
      data: {
        title_en: data.MEALS[timeKey][0],
        title_ml: data.MEALS[timeKey][1]
      }
    });
  }

  console.log("✅ Daily water + meal reminders seeded");
}

module.exports = { seedDailyReminders };
