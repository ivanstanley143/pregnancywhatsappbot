const data = require("../data");
const utils = require("../utils");
const { sendTextMessage } = require("../whatsappCloud");

function getCurrentDua() {
  const week = utils.getPregnancyWeek();
  return data.WEEKLY_DUA[week] || { title: "🤲 Dua", text: "Allahumma ihfazna" };
}

async function sendWeeklyDua() {
  const d = getCurrentDua();
  await sendTextMessage(data.USER, utils.format(`${d.title}\n${d.text}`));
}

async function sendDailyDua() {
  await sendWeeklyDua();
}

module.exports = { sendWeeklyDua, sendDailyDua };
