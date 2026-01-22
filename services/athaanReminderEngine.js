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

const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const nowMin = now.getHours() * 60 + now.getMinutes();

    // 🔄 Fetch once per day
    if (cachedDate !== today) {
      cachedTimes = await getTodayPrayerTimes();
      cachedDate = today;
      sent = {};
      console.log("🕌 Athaan times cached for", today, cachedTimes);
    }

    if (!cachedTimes) return;

    // 🔴 TEST MODE (REMOVE AFTER TEST)
    const TEST_PRAYER = "Asr";
    const TEST_TIME = "03:28"; // Set 2 minutes ahead of current time

    for (const prayer of PRAYERS) {
      let time = cachedTimes[prayer];
      if (!time) continue;

      // 🔴 Force test time
      if (prayer === TEST_PRAYER) {
        time = TEST_TIME;
      }

      const key = `${today}-${prayer}`;
      if (sent[key]) continue;

      const prayerMin = toMinutes(time);

      if (nowMin >= prayerMin && nowMin <= prayerMin + 3) {
        await sendTemplate(
          data.USER,
          "athaan_reminder",
          [prayer]
        );

        sent[key] = true;
        console.log(`🕌 ${prayer} reminder sent at ${time}`);
      }
    }
  } catch (err) {
    console.error("❌ Athaan reminder engine error:", err.message);
  }
});
