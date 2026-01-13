const cron = require("node-cron");
const { sendTemplate } = require("../whatsappCloud");
const data = require("../data");
const { getWeek } = require("../utils");

// Every day 9am
cron.schedule("0 9 * * *", () => {
  const week = getWeek();
  const dua = data.WEEKLY_DUA[week];
  if (!dua) return;

  sendTemplate(data.USER, "pregnancy_dua", [
    data.NAME,
    dua
  ]);
});
