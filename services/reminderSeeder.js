const Reminder = require("../models/Reminder");
const data = require("../data");
const utils = require("../utils");

async function seedReminders() {
  console.log("🌱 Seeding reminders...");

  const todayStart = utils.now().startOf("day").toDate();
  const todayEnd = utils.now().endOf("day").toDate();

  // 🧹 Prevent duplicates for today
  await Reminder.deleteMany({
    scheduledAt: { $gte: todayStart, $lte: todayEnd },
    type: { $in: ["water", "meal"] }
  });

  // 💧 WATER REMINDERS
  for (const t of data.WATER_TIMES) {
    await Reminder.create({
      user: data.USER,
      type: "water",
      scheduledAt: utils.timeToday(t)
    });
  }

  // 🍽 MEAL REMINDERS
  const meals = {
    "09:00": ["🍽️ Breakfast time", "🍽️ പ്രഭാതഭക്ഷണ സമയം"],
    "11:00": ["🍎 Snack time", "🍎 ഇടക്കാല ലഘുഭക്ഷണം"],
    "14:00": ["🥗 Light meal time", "🥗 ലഘുഭക്ഷണ സമയം"],
    "17:00": ["☕ Evening snack time", "☕ സായാഹ്ന ലഘുഭക്ഷണം"],
    "19:30": ["🍽️ Dinner time", "🍽️ രാത്രി ഭക്ഷണം"],
    "21:30": ["🥛 Light food time", "🥛 പാൽ / ലഘുഭക്ഷണം"]
  };

  for (const t in meals) {
    await Reminder.create({
      user: data.USER,
      type: "meal",
      scheduledAt: utils.timeToday(t),
      data: {
        en: meals[t][0],
        ml: meals[t][1]
      }
    });
  }

  // 🤲 WEEKLY DUA (Friday 9 AM)
  const { week } = utils.getPregnancy();
  const friday9am = utils.nextFridayAt("09:00");

  await Reminder.create({
    user: data.USER,
    type: "dua",
    scheduledAt: friday9am,
    data: { week }
  });

  // 📅 APPOINTMENTS (USER + HUSBAND)
  for (const a of data.APPOINTMENTS) {
    for (const u of [data.USER, data.HUSBAND]) {
      await Reminder.create({
        user: u,
        type: "appointment",
        scheduledAt: utils.combineDateTime(a.date, a.time),
        data: a
      });
    }
  }

  // 🤰 WEEKLY BABY GROWTH (USER + HUSBAND)
  for (let w = 1; w <= 40; w++) {
    if (!data.BABY_IMAGES[w]) continue;

    for (const u of [data.USER, data.HUSBAND]) {
      await Reminder.create({
        user: u,
        type: "week",
        scheduledAt: utils.weekStartDate(w),
        data: {
          week: w,
          image: data.BABY_IMAGES[w].image,
          size: data.BABY_IMAGES[w].size
        }
      });
    }
  }

  // 🌸 TRIMESTERS (USER + HUSBAND)
for (const t of [1, 2, 3]) {
  for (const u of [data.USER, data.HUSBAND]) {
    await Reminder.create({
      user: u,
      type: "trimester",
      scheduledAt: utils.trimesterStartDate(t),
      data: { trimester: t }
    });
  }
}
  console.log("✅ Reminder seeding completed");
}

module.exports = seedReminders;
