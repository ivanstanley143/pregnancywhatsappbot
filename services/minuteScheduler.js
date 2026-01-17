const cron = require("node-cron");
const data = require("../data");
const { sendTemplate } = require("../whatsappCloud");

console.log("⏱️ Minute scheduler loaded");

const sentToday = new Set();

function getHHMM() {
  const now = new Date();
  return now.toTimeString().slice(0, 5); // "19:30"
}

function getTodayKey(prefix, hhmm) {
  const d = new Date();
  return `${prefix}-${hhmm}-${d.toDateString()}`;
}

cron.schedule("* * * * *", async () => {
  const hhmm = getHHMM();

  /* =====================
     💧 WATER REMINDER
  ===================== */
  if (data.WATER_TIMES.includes(hhmm)) {
    const key = getTodayKey("water", hhmm);
    if (!sentToday.has(key)) {
      await sendTemplate(
        data.USER,
        "pregnancy_water_reminder_v1",
        []
      );
      sentToday.add(key);
      console.log("💧 Water reminder sent:", hhmm);
    }
  }

  /* =====================
     🍽️ MEAL REMINDER
  ===================== */
  if (data.MEALS[hhmm]) {
    const key = getTodayKey("meal", hhmm);
    if (!sentToday.has(key)) {
      await sendTemplate(
        data.USER,
        "pregnancy_meal_reminder",
        [String(data.MEALS[hhmm])]
      );
      sentToday.add(key);
      console.log("🍽️ Meal reminder sent:", hhmm);
    }
  }
});
