// Force India timezone
process.env.TZ = "Asia/Kolkata";

const cron = require("node-cron");
const { sendTemplate } = require("../whatsappCloud");
const data = require("../data");
const { getTodayPrayerTimes } = require("./athaanService");

let cachedTimes = null;
let cachedDate = null;
let sent = {};

// Convert HH:MM → minutes
const toMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// Only real prayers
const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

// Run every minute
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    // ⚠️ DO NOT use toISOString() (it gives UTC)
    const today = now.toLocaleDateString("en-CA"); // YYYY-MM-DD India time
    const nowMin = now.getHours() * 60 + now.getMinutes();

    /* ===============================
       FETCH ATHAAN TIMES ONCE PER DAY
    =============================== */
    if (cachedDate !== today) {
      cachedTimes = await getTodayPrayerTimes();
      cachedDate = today;
      sent = {};
      console.log("🕌 Athaan times cached for", today, cachedTimes);
    }

    if (!cachedTimes) return;

    /* ===============================
       CHECK EACH PRAYER
    =============================== */
    for (const prayer of PRAYERS) {
      const time = cachedTimes[prayer];
      if (!time) continue;

      const key = `${today}-${prayer}`;
      if (sent[key]) continue; // already sent today

      const prayerMin = toMinutes(time);

      // 3-minute window to avoid cron lag
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
