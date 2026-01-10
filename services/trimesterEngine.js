const Reminder = require("../models/Reminder");
const data = require("../data");
const utils = require("../utils");
const { sendImageMessage } = require("../whatsappCloud");

async function processTrimesterChange() {
  const trimester = utils.getTrimester(utils.getPregnancyWeek());
  const sent = await Reminder.findOne({ type: "trimester", data: { trimester } });
  if (sent) return;

  const caption = utils.format(
    `🌸 Trimester ${trimester} started`,
    `🌸 ട്രൈമെസ്റ്റർ ${trimester} ആരംഭിച്ചു`
  );

  await sendImageMessage(data.USER, data.TRIMESTER_IMAGES[trimester], caption);
  await sendImageMessage(data.HUSBAND, data.TRIMESTER_IMAGES[trimester], caption);

  await Reminder.create({ type: "trimester", data: { trimester }, sent: true });
}

module.exports = { processTrimesterChange };
