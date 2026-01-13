const Reminder = require("../models/Reminder");
const data = require("../data");
const moment = require("moment-timezone");

async function seedDailyReminders() {
  const tz = data.TIMEZONE || "Asia/Kolkata";

  // Clear old daily reminders
  await Reminder.deleteMany({ type: { $in: ["water", "meal"] } });

  // WATER reminders
  for (const t of data.WATER_TIMES) {
    const [hour, minute] = t.split(":");

    let time = moment().tz(tz).hour(hour).minute(minute).second(0);

    if (time.isBefore(moment().tz(tz))) {
      time = time.add(1, "day");
    }

    await Reminder.create({
      user: data.USER,   // 🔴 REQUIRED
      type: "water",
      scheduledAt: time.toDate(),
      sent: false
    });
  }

  // MEAL reminders
  for (const timeKey of Object.keys(data.MEALS)) {
    const [hour, minute] = timeKey.split(":");

    let time = moment().tz(tz).hour(hour).minute(minute).second(0);

    if (time.isBefore(moment().tz(tz))) {
      time = time.add(1, "day");
    }

    await Reminder.create({
      user: data.USER,   // 🔴 REQUIRED
      type: "meal",
      scheduledAt: time.toDate(),
      data: {
        title_en: data.MEALS[timeKey][0],
        title_ml: data.MEALS[timeKey][1]
      },
      sent: false
    });
  }

  console.log("✅ Daily water + meal reminders seeded");
}

module.exports = { seedDailyReminders };

