
const cron = require("node-cron");
const data = require("../data");
const { sendTemplate } = require("../whatsappCloud");
const SentReminder = require("../models/SentReminder");

console.log("⏱️ Minute scheduler loaded");

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function getHHMM() {
  return new Date().toTimeString().slice(0, 5);
}

async function alreadySent(type, time) {
  return SentReminder.exists({
    type,
    time,
    date: todayKey()
  });
}

async function markSent(type, time) {
  await SentReminder.create({
    type,
    time,
    date: todayKey()
  });
}

cron.schedule("* * * * *", async () => {
  const hhmm = getHHMM();

  /* 💧 WATER */
  if (data.WATER_TIMES.includes(hhmm)) {
    if (!(await alreadySent("water", hhmm))) {
      await sendTemplate(data.USER, "pregnancy_water_reminder_v1", []);
      await markSent("water", hhmm);
      console.log("💧 Water sent:", hhmm);
    }
  }

  /* 🍽️ MEAL */
  if (data.MEALS[hhmm]) {
    if (!(await alreadySent("meal", hhmm))) {
      await sendTemplate(
        data.USER,
        "pregnancy_meal_reminder",
        [String(data.MEALS[hhmm])]
      );
      await markSent("meal", hhmm);
      console.log("🍽️ Meal sent:", hhmm);
    }
  }
});
