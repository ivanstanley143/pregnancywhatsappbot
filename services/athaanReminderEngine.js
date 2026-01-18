const cron = require("node-cron");
const { sendTemplate } = require("../whatsappCloud");
const data = require("../data");
const { getTodayPrayerTimes } = require("./athaanService");

let sentToday = {};

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const current = now.toTimeString().slice(0,5); // HH:MM

  const times = await getTodayPrayerTimes();

  for (const [prayer, time] of Object.entries(times)) {
    if (sentToday[prayer] === time) continue;

    if (current === time) {
      await sendTemplate(
        data.USER,
        "athaan_reminder",
        [prayer]
      );

      sentToday[prayer] = time;
      console.log(`🕌 ${prayer} reminder sent`);
    }
  }

  // Reset at midnight
  if (current === "00:01") {
    sentToday = {};
  }
});
