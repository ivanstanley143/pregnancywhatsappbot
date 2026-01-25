const cron = require("node-cron");
const data = require("../data");
const { sendTemplate } = require("../whatsappCloud");

let lastRun = {};
let lastDate = new Date().toDateString();

// Helper: normalize HH:MM
const getTime = () => {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
};

// Run every minute
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const today = now.toDateString();
    const currentTime = getTime();

    /* ================================
       🔄 RESET DAILY STATE AT MIDNIGHT
    ================================ */
    if (today !== lastDate) {
      lastRun = {};
      lastDate = today;
      console.log("🔄 Daily reminder state reset");
    }

    /* ================================
       💧 WATER REMINDERS
    ================================ */
    if (Array.isArray(data.WATER_TIMES) && data.WATER_TIMES.includes(currentTime)) {
      const key = `water-${today}-${currentTime}`;

      if (!lastRun[key]) {
        try {
          await sendTemplate(data.USER, "pregnancy_water_reminder_v1", []);
          lastRun[key] = true;
          console.log("💧 Water reminder sent:", currentTime);
        } catch (err) {
          console.error("❌ Water reminder failed:", err.response?.data || err.message);
        }
      }
    }

    /* ================================
       🍽️ MEAL REMINDERS
    ================================ */
    if (data.MEALS && data.MEALS[currentTime]) {
      const key = `meal-${today}-${currentTime}`;

      if (!lastRun[key]) {
        try {
          await sendTemplate(
            data.USER,
            "pregnancy_meal_reminder",
            [String(data.MEALS[currentTime])]
          );
          lastRun[key] = true;
          console.log("🍽️ Meal reminder sent:", currentTime);
        } catch (err) {
          console.error("❌ Meal reminder failed:", err.response?.data || err.message);
        }
      }
    }

    /* ================================
       🧠 DEBUG HEARTBEAT (OPTIONAL)
    ================================ */
    if (now.getMinutes() % 10 === 0) {
      console.log("🧠 MinuteScheduler alive:", currentTime);
    }

  } catch (err) {
    console.error("🔥 MinuteScheduler crash prevented:", err.stack || err.message);
  }
});
