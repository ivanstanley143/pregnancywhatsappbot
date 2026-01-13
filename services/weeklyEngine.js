const cron = require("node-cron");
const { sendTemplate } = require("../whatsappCloud");
const data = require("../data");
const { getWeek } = require("../utils");

// Every Monday 9 AM
cron.schedule("0 9 * * 1", () => {
  const week = getWeek();
  const baby = data.BABY_IMAGES[week];
  if (!baby) return;

  sendTemplate(data.USER, "pregnancy_week_update", [
    String(week),
    baby.size
  ]);
});
