const utils = require("../utils");
const data = require("../data");
const { sendTextMessage } = require("../whatsappCloud");

async function sendWeeklyUpdate() {
  const week = utils.getPregnancyWeek();
  const trimester = utils.getTrimester(week);

  const msg = utils.format(
    `🤰 Week ${week}\nTrimester ${trimester}`,
    `🤰 ${week} ആഴ്ച\nട്രൈമെസ്റ്റർ ${trimester}`
  );

  await sendTextMessage(data.USER, msg);
  await sendTextMessage(data.HUSBAND, msg);
}

module.exports = { sendWeeklyUpdate };
