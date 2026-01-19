const cron = require("node-cron");
const { sendTemplate } = require("../whatsappCloud");
const data = require("../data");
const { getTodayPrayerTimes } = require("./athaanService");

let todayTimes = null;
let sentToday = {};
let lastFetchedDate = null;

// Convert HH:MM → minutes
function toMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const today = now.toDateString();

    /* =========================
       🔁 Fetch prayer times ONCE per day
    ========================== */
    if (lastFetchedDate !== today) {
      console.log("🕌 Fetching today's prayer times");
      todayTimes = await getTodayPrayerTimes();
      sentToday = {};
      lastFetchedDate = today;
    }

    if (!todayTimes) return;

    /* =========================
       ⏰ Check prayer windows
    ========================== */
    for (const [prayer, time] of Object.entries(todayTimes)) {
      if (!time || sentToday[prayer]) continue;

      const prayerMin = toMinutes(time);

      // Allow 1-minute window
      if (currentMinutes >= prayerMin && currentMinutes < prayerMin + 1) {
        await sendTemplate(
          data.USER,
          "athaan_reminder",
          [String(prayer)]
        );

        sentToday[prayer] = true;
        console.log(`🕌 ${prayer} reminder sent at ${time}`);
      }
    }
  } catch (err) {
    console.error("❌ Athaan Reminder Error:", err.message);
  }
});
