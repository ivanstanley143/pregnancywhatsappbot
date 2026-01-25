process.env.TZ = "Asia/Kolkata";

const cron = require("node-cron");
const { sendTemplate } = require("../whatsappCloud");
const data = require("../data");
const { getPregnancyWeek } = require("../utils");

let lastSentDate = null;

// ================================
// 🤲 DAILY DUA SENDER (SAFE)
// ================================
async function sendDailyDua() {
  try {
    const today = new Date().toDateString();

    // Prevent duplicate sending same day (after restart)
    if (lastSentDate === today) {
      console.log("⚠️ Daily dua already sent today");
      return;
    }

    const week = getPregnancyWeek();

    const duaText =
      data.WEEKLY_DUA?.[week] ||
      "رَبِّي يَسِّرْ وَلَا تُعَسِّرْ وَتَمِّمْ بِالْخَيْرِ Rabbi yassir wala tu’assir wa tammim bil khair";

    await sendTemplate(data.USER, "pregnancy_dua", [
      String(data.NAME || "Mother"), // {{1}}
      String(duaText)                // {{2}}
    ]);

    lastSentDate = today;
    console.log("🤲 Daily dua sent | Week:", week, "| Date:", today);

  } catch (err) {
    console.error("❌ Daily dua failed:", err.response?.data || err.message);
  }
}

// ================================
// ⏰ CRON TIME FROM .env
// ================================
const time = process.env.DAILY_DUA_TIME || "09:00";
const [hour, minute] = time.split(":");

// Validate time format
if (!hour || !minute) {
  console.error("❌ DAILY_DUA_TIME invalid. Using 09:00");
}

// Runs every day at DAILY_DUA_TIME
cron.schedule(`${minute} ${hour} * * *`, () => {
  console.log("⏰ Daily dua cron triggered:", new Date().toLocaleTimeString());
  sendDailyDua();
});

// ================================
// 🧠 HEARTBEAT LOG (every 6 hours)
// ================================
cron.schedule("0 */6 * * *", () => {
  console.log("🧠 DuaEngine alive:", new Date().toISOString());
});

module.exports = { sendDailyDua };
