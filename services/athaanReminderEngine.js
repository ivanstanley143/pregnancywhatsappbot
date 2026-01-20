const cron = require("node-cron");
const { sendTemplate } = require("../whatsappCloud");
const data = require("../data");
const { getTodayPrayerTimes } = require("./athaanService");

let cachedTimes = null;
let cachedDate = null;
let sent = {};

const toMinutes = t => {
  const [h,m] = t.split(":").map(Number);
  return h * 60 + m;
};

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const today = now.toISOString().slice(0,10);
  const nowMin = now.getHours() * 60 + now.getMinutes();

  // Fetch prayer times once per day
  if (cachedDate !== today) {
    cachedTimes = await getTodayPrayerTimes();
    cachedDate = today;
    sent = {};
    console.log("🕌 Athaan times cached for", today);
  }

  if (!cachedTimes) return;

  for (const [prayer, time] of Object.entries(cachedTimes)) {
    const key = `${today}-${prayer}`;
    if (sent[key]) continue;

    const prayerMin = toMinutes(time);

    if (nowMin >= prayerMin && nowMin <= prayerMin + 1) {
      await sendTemplate(
        data.USER,
        "athaan_reminder",
        [prayer]
      );

      sent[key] = true;
      console.log(`🕌 ${prayer} reminder sent`);
    }
  }
});
