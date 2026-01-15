const cron = require("node-cron");
const { sendTemplate } = require("../whatsappCloud");
const data = require("../data");
const { getPregnancyWeek } = require("../utils");

// ================================
// DAILY DUA SENDER (SAFE)
// ================================
async function sendDailyDua() {
  const week = getPregnancyWeek();

  const duaText =
    data.WEEKLY_DUA[week] ??
    "رَبِّي تَمِّمْ بِالْخَيْرِ Rabbi tammim bil khair";

  await sendTemplate(data.USER, "pregnancy_dua", [
    String(data.NAME || "Mother"), // {{1}}
    String(duaText)                // {{2}}
  ]);

  console.log("🤲 Daily dua sent for week", week);
}

// ================================
// CRON TIME FROM .env
// ================================
const time = process.env.DAILY_DUA_TIME || "09:00";
const [hour, minute] = time.split(":");

// Runs every day at DAILY_DUA_TIME
cron.schedule(`${minute} ${hour} * * *`, () => {
  sendDailyDua().catch(err => {
    console.error("❌ Daily dua failed", err);
  });
});

module.exports = { sendDailyDua };
