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

// Only real prayers
const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

cron.schedule("* * * * *", async () => {
  try {

    /* 🧪 TEMP TEST — REMOVE AFTER CONFIRMATION */
    await sendTemplate(
      data.USER,
      "athaan_reminder",
      ["Test Prayer"]
    );
    console.log("🧪 Test Athaan template sent");
    return; // ⛔ STOP HERE DURING TEST ONLY

    // ===== NORMAL LOGIC BELOW (WILL RUN AFTER TEST REMOVAL) =====

    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const nowMin = now.getHours() * 60 + now.getMinutes();

    /* 🔄 Fetch once per day */
    if (cachedDate !== today) {
      cachedTimes = await getTodayPrayerTimes();
      cachedDate = today;
      sent = {};
      console.log("🕌 Athaan times cached for", today);
    }

    if (!cachedTimes) return;

    for (const prayer of PRAYERS) {
      const time = cachedTimes[prayer];
      if (!time) continue;

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
        console.log(`🕌 ${prayer} reminder sent at ${time}`);
      }
    }
  } catch (err) {
    console.error("❌ Athaan reminder engine error:", err.message);
  }
});
