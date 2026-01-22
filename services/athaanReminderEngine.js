process.env.TZ = "Asia/Kolkata";

const cron = require("node-cron");
const { sendTemplate } = require("../whatsappCloud");
const data = require("../data");
const { getTodayPrayerTimes } = require("./athaanService");

let cachedTimes = null;
let cachedDate = null;
let sent = {};

const toMinutes = t => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// Only real prayer names
const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const nowMin = now.getHours() * 60 + now.getMinutes();

    /* 🔄 Fetch prayer times once per day */
    if (cachedDate !== today) {
      cachedTimes = await getTodayPrayerTimes();
      cachedDate = today;
      sent = {};
      console.log("🕌 Athaan times cached for", today, cachedTimes);
    }

    if (!cachedTimes) return;

    for (const prayer of PRAYERS) {
      const time = cachedTimes[prayer];
      if (!time) continue;

      const key = `${today}-${prayer}`;
      if (sent[key]) continue;

      const prayerMin = toMinutes(time);

      // 3 minute safety window
      if (nowMin >= prayerMin && nowMin <= prayerMin + 3) {
        await sendTemplate(
          data.USER,
          "athaan_reminder",
          [prayer] // {{1}}
        );

        sent[key] = true;
        console.log(`🕌 ${prayer} reminder sent at ${time}`);
      }
    }
  } catch (err) {
    console.error("❌ Athaan reminder engine error:", err.message);
  }
});
