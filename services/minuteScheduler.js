// FORCE TIMEZONE FOR NODE
process.env.TZ = "Asia/Kolkata";

const cron = require("node-cron");
const data = require("../data");
const { sendTemplate } = require("../whatsappCloud");

let lastRun = {};
let lastDate = new Date().toDateString();

/* =========================
   SAFE TIME FORMATTER (HH:MM)
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

    // DEBUG heartbeat every minute
    console.log("⏱️ TICK:", now.toString(), "->", currentTime);

    /* =========================
       RESET DAILY STATE AT MIDNIGHT
    ========================= */
    if (today !== lastDate) {
      lastRun = {};
      lastDate = today;
      console.log("🔄 Daily reminder state reset");
    }

    /* =========================
       💧 WATER REMINDERS
    ========================= */
    if (Array.isArray(data.WATER_TIMES)) {
      console.log("💧 Water times loaded:", data.WATER_TIMES);

      if (data.WATER_TIMES.includes(currentTime)) {
        const key = `water-${today}-${currentTime}`;

        if (!lastRun[key]) {
          try {
            await sendTemplate(data.USER, "pregnancy_water_reminder_v1", []);
            lastRun[key] = true;
            console.log("✅ Water reminder SENT at", currentTime);
          } catch (err) {
            console.error("❌ Water reminder failed:", err.response?.data || err.message);
          }
        }
      }
    }

    /* =========================
       🍽️ MEAL REMINDERS
    ========================= */
    if (data.MEALS) {
      console.log("🍽️ Meal keys:", Object.keys(data.MEALS));

      if (data.MEALS[currentTime]) {
        const key = `meal-${today}-${currentTime}`;

        if (!lastRun[key]) {
          try {
            await sendTemplate(
              data.USER,
              "pregnancy_meal_reminder",
              [String(data.MEALS[currentTime])]
            );
            lastRun[key] = true;
            console.log("✅ Meal reminder SENT at", currentTime);
          } catch (err) {
            console.error("❌ Meal reminder failed:", err.response?.data || err.message);
          }
        }
      }
    }

    /* =========================
       HEARTBEAT LOG EVERY 10 MINUTES
    ========================= */
    if (now.getMinutes() % 10 === 0) {
      console.log("🧠 MinuteScheduler alive:", currentTime);
    }

  } catch (err) {
    console.error("🔥 MinuteScheduler CRASH prevented:", err.stack || err.message);
  }
});
