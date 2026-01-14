const cron = require("node-cron");
const { sendTemplate } = require("../whatsappCloud");
const data = require("../data");
const { getPregnancyWeek } = require("../utils");

// ================================
// DAILY DUA SENDER
// ================================
async function sendDailyDua() {
  const week = getPregnancyWeek();
  const dua = data.WEEKLY_DUA[week];
  if (!dua) return;

  await sendTemplate(data.USER, "pregnancy_dua", [
    data.NAME,   // {{1}}
    dua          // {{2}}
  ]);

  console.log("🤲 Daily dua sent");
}

// ================================
// CRON TIME FROM .env
// ================================
const time = process.env.DAILY_DUA_TIME || "09:00";
const [hour, minute] = time.split(":");

// Runs every day at DAILY_DUA_TIME
cron.schedule(`${minute} ${hour} * * *`, () => {
  sendDailyDua().catch(console.error);
});

module.exports = { sendDailyDua };
