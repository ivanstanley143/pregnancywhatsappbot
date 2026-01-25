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

// Only real prayer names
const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

// 🔴 TEST CONFIG (SET TO false IN PRODUCTION)
const TEST_MODE = false;        // ❗ IMPORTANT
const TEST_PRAYER = "Dhuhr";
const TEST_TIME = "10:10";

// ================================
// MAIN CRON (EVERY MINUTE)
// ================================
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const today = now.toLocaleDateString("en-CA"); // YYYY-MM-DD in IST
    const nowMin = now.getHours() * 60 + now.getMinutes();

    // 🔄 Fetch prayer times once per day
    if (cachedDate !== today) {
      try {
        cachedTimes = await getTodayPrayerTimes();
        cachedDate = today;
        sent = {};
        console.log("🕌 Athaan times cached for", today, cachedTimes);
      } catch (err) {
        console.error("❌ Failed to fetch prayer times:", err.message);
        return;
      }
    }

    if (!cachedTimes) return;

    for (const prayer of PRAYERS) {
      let time = cachedTimes[prayer];
      if (!time) continue;

      // 🔴 FORCE TEST TIME
      if (TEST_MODE && prayer === TEST_PRAYER) {
        time = TEST_TIME;
      }

      const key = `${today}-${prayer}`;
      if (sent[key]) continue;

      const prayerMin = toMinutes(time);

      // 3-minute window
      if (nowMin >= prayerMin && nowMin <= prayerMin + 3) {
        try {
          await sendTemplate(
            data.USER,
            "athaan_reminder",
            [String(prayer)]
          );

          sent[key] = true;
          console.log(`🕌 ${prayer} reminder sent at ${time}`);
        } catch (err) {
          console.error(`❌ Failed to send ${prayer} reminder:`, err.response?.data || err.message);
        }
      }
    }
  } catch (err) {
    console.error("❌ Athaan reminder engine crash:", err);
  }
});

// ================================
// HEARTBEAT LOG (EVERY 6 HOURS)
// ================================
cron.schedule("0 */6 * * *", () => {
  console.log("🧠 AthaanReminderEngine alive:", new Date().toISOString());
});
