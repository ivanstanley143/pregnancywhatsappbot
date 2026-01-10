const Reminder = require("../models/Reminder");
const data = require("../data");
const utils = require("../utils");
const { sendImageMessage } = require("../whatsappCloud");

async function processBabyGrowth() {
  const week = utils.getPregnancyWeek();
  const growth = data.BABY_GROWTH[week];
  if (!growth) return;

  const sent = await Reminder.findOne({ type: "week", data: { week } });
  if (sent) return;

  const caption = utils.format(
    `🤰 Week ${week}\nBaby size: ${growth.size}`,
    `🤰 ${week} ആഴ്ച\nകുഞ്ഞിന്റെ വലുപ്പം: ${growth.size}`
  );

  await sendImageMessage(data.USER, growth.image, caption);
  await sendImageMessage(data.HUSBAND, growth.image, caption);

  await Reminder.create({ type: "week", data: { week }, sent: true });
}

module.exports = { processBabyGrowth };
