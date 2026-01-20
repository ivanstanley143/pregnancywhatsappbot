const cron = require("node-cron");
const data = require("../data");
const { sendTemplate } = require("../whatsappCloud");

let lastRun = {};
let lastDate = new Date().toDateString();

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    // 🔁 RESET DAILY STATE AT MIDNIGHT
    if (now.toDateString() !== lastDate) {
      lastRun = {};
      lastDate = now.toDateString();
      console.log("🔄 Daily reminder state reset");
    }

    const currentTime = now.toTimeString().slice(0, 5); // HH:MM

    /* ================================
       💧 WATER REMINDERS
    ================================ */
    try {
      if (data.WATER_TIMES.includes(currentTime)) {
        if (!lastRun[`water-${currentTime}`]) {
          await sendTemplate(
            data.USER,
            "pregnancy_water_reminder_v1",
            []
          );
          lastRun[`water-${currentTime}`] = true;
          console.log("💧 Water reminder sent:", currentTime);
        }
      }
    } catch (err) {
      console.error("❌ Water reminder failed:", err.message);
    }

    /* ================================
       🍽️ MEAL REMINDERS
    ================================ */
    try {
      if (data.MEALS[currentTime]) {
        if (!lastRun[`meal-${currentTime}`]) {
          await sendTemplate(
            data.USER,
            "pregnancy_meal_reminder",
            [String(data.MEALS[currentTime])]
          );
          lastRun[`meal-${currentTime}`] = true;
          console.log("🍽️ Meal reminder sent:", currentTime);
        }
      }
    } catch (err) {
      console.error("❌ Meal reminder failed:", err.message);
    }

  } catch (err) {
    console.error("🔥 Minute scheduler crash prevented:", err.message);
  }
});
