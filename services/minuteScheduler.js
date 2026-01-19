const cron = require("node-cron");
const data = require("../data");
const { sendTemplate } = require("../whatsappCloud");

let lastRun = {};

cron.schedule("* * * * *", async () => {
  const now = new Date();

  const dateKey = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM

  /* ================================
     💧 WATER REMINDERS
  ================================ */
  if (data.WATER_TIMES.includes(currentTime)) {
    const key = `water-${dateKey}-${currentTime}`;

    if (!lastRun[key]) {
      await sendTemplate(
        data.USER,
        "pregnancy_water_reminder_v1",
        []
      );
      lastRun[key] = true;
      console.log("💧 Water reminder sent:", dateKey, currentTime);
    }
  }

  /* ================================
     🍽️ MEAL REMINDERS
  ================================ */
  if (data.MEALS[currentTime]) {
    const key = `meal-${dateKey}-${currentTime}`;

    if (!lastRun[key]) {
      await sendTemplate(
        data.USER,
        "pregnancy_meal_reminder",
        [String(data.MEALS[currentTime])]
      );
      lastRun[key] = true;
      console.log("🍽️ Meal reminder sent:", dateKey, currentTime);
    }
  }
});
