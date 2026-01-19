const cron = require("node-cron");
const data = require("../data");
const { sendTemplate } = require("../whatsappCloud");

let lastRun = {};

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM

  /* ================================
     💧 WATER REMINDERS
  ================================ */
  if (data.WATER_TIMES.includes(currentTime)) {
    if (lastRun[`water-${currentTime}`] !== currentTime) {
      await sendTemplate(
        data.USER,
        "pregnancy_water_reminder_v1",
        []
      );
      lastRun[`water-${currentTime}`] = currentTime;
      console.log("💧 Water reminder sent:", currentTime);
    }
  }

  /* ================================
     🍽️ MEAL REMINDERS
  ================================ */
  if (data.MEALS[currentTime]) {
    if (lastRun[`meal-${currentTime}`] !== currentTime) {
      await sendTemplate(
        data.USER,
        "pregnancy_meal_reminder",
        [String(data.MEALS[currentTime])]
      );
      lastRun[`meal-${currentTime}`] = currentTime;
      console.log("🍽️ Meal reminder sent:", currentTime);
    }
  }
});
