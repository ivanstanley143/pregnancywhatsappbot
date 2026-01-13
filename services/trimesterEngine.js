const Reminder = require("../models/Reminder");
const { sendTemplate } = require("../whatsappCloud");
const data = require("../data");
const utils = require("../utils");

async function processTrimesterChange() {
  const trimester = utils.getTrimester(utils.getPregnancyWeek());

  const sent = await Reminder.findOne({ type: "trimester", "data.trimester": trimester });
  if (sent) return;

  await sendTemplate(data.USER, "pregnancy_trimester_update", [
    {
      type: "body",
      parameters: [{ type: "text", text: String(trimester) }]
    }
  ]);

  await Reminder.create({ type: "trimester", data: { trimester }, sent: true });
}

module.exports = { processTrimesterChange };
