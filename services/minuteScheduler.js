const cron = require("node-cron");
const data = require("../data");
const { sendTemplate } = require("../whatsappCloud");

let lastRun = {};
let lastDate = null;

/* ================================
   ⏱️ RUN EVERY MINUTE
================================ */
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    // Force IST (important)
    const ist = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const currentDate = ist.toISOString().slice(0, 10); // YYYY-MM-DD
    const currentTime = ist.toTimeString().slice(0, 5); // HH:MM

    /* ================================
       🔄 RESET DAILY
    ================================ */
    if (lastDate !== currentDate) {
      lastRun = {};
      lastDate = currentDate;
      console.log("🔄 Daily scheduler reset:", currentDate);
    }

    /* ================================
       💧 WATER REMINDERS
    ================================ */
    if (data.WATER_TIMES.includes(currentTime)) {
      const key = `water-${currentTime}`;

      if (!lastRun[key]) {
        await sendTemplate(
          data.USER,
          "pregnancy_water_reminder_v1",
          []
        );

        lastRun[key] = true;
        console.log("💧 Water reminder sent:", currentTime);
      }
    }

    /* ================================
       🍽️ MEAL REMINDERS
    ================================ */
    if (data.MEALS[currentTime]) {
      const key = `meal-${currentTime}`;

      if (!lastRun[key]) {
        await sendTemplate(
          data.USER,
          "pregnancy_meal_reminder",
          [String(data.MEALS[currentTime])] // {{1}}
        );

        lastRun[key] = true;
        console.log("🍽️ Meal reminder sent:", currentTime);
      }
    }

  } catch (err) {
    console.error("⛔ MinuteScheduler error:", err.message);
  }
});
