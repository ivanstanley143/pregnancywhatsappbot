process.env.TZ = "Asia/Kolkata";

const cron = require("node-cron");
const data = require("../data");
const { sendTemplate } = require("../whatsappCloud");

let lastRun = {};
let lastDate = new Date().toDateString();

/* =========================
   SAFE TIME FORMATTER
========================= */
const getTime = () => {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
};

/* =========================
   RUN EVERY MINUTE
========================= */
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const today = now.toDateString();
    const currentTime = getTime();

    /* RESET DAILY STATE */
    if (today !== lastDate) {
      lastRun = {};
      lastDate = today;
      console.log("🔄 Daily reminder state reset");
    }

    /* 💧 WATER REMINDERS */
    if (Array.isArray(data.WATER_TIMES) && data.WATER_TIMES.includes(currentTime)) {
      const key = `water-${today}-${currentTime}`;

      if (!lastRun[key]) {
        await sendTemplate(data.USER, "pregnancy_water_reminder_v1", []);
        lastRun[key] = true;
        console.log("💧 Water reminder sent:", currentTime);
      }
    }

    /* 🍽️ MEAL REMINDERS */
    if (data.MEALS && data.MEALS[currentTime]) {
      const key = `meal-${today}-${currentTime}`;

      if (!lastRun[key]) {
        await sendTemplate(
          data.USER,
          "pregnancy_meal_reminder",
          [String(data.MEALS[currentTime])]
        );
        lastRun[key] = true;
        console.log("🍽️ Meal reminder sent:", currentTime);
      }
    }

    /* HEARTBEAT LOG */
    if (now.getMinutes() % 10 === 0) {
      console.log("🧠 MinuteScheduler alive:", currentTime);
    }

  } catch (err) {
    console.error("🔥 MinuteScheduler crash prevented:", err.stack || err.message);
  }
});
