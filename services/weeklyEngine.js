const { sendTemplate } = require("../whatsappCloud");
const data = require("../data");
const utils = require("../utils");

async function sendWeekUpdate() {
  const week = utils.getPregnancyWeek();
  const baby = data.BABY_IMAGES[week];

  await sendTemplate(data.USER, "pregnancy_week_update", [
    {
      type: "body",
      parameters: [
        { type: "text", text: String(week) },
        { type: "text", text: baby.size }
      ]
    }
  ]);
}

module.exports = { sendWeekUpdate };
