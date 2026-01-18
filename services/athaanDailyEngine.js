const cron = require("node-cron");
const { sendTemplate } = require("../whatsappCloud");
const data = require("../data");
const { getTodayPrayerTimes } = require("./athaanService");

// Send daily timetable at 5:30 AM
cron.schedule("30 5 * * *", async () => {
  try {
    const t = await getTodayPrayerTimes();

    await sendTemplate(
      data.USER,
      "athaan_daily_timetable",
      [
        t.Fajr,
        t.Sunrise,
        t.Dhuhr,
        t.Asr,
        t.Maghrib,
        t.Isha
      ]
    );

    console.log("🕌 Daily Athaan timetable sent");
  } catch (e) {
    console.error("Athaan timetable error:", e.message);
  }
});
