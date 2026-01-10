const Reminder = require("../models/Reminder");
const data = require("../data");
const utils = require("../utils");

async function seedDailyReminders() {
  await Reminder.deleteMany({ type: { $in: ["water", "meal"] } });

  data.WATER_TIMES.forEach(t =>
    Reminder.create({ type: "water", scheduledAt: utils.now().hour(t.split(":")[0]).minute(t.split(":")[1]).toDate() })
  );
}

module.exports = { seedDailyReminders };
