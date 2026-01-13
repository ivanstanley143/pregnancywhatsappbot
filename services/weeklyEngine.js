const { sendTemplate } = require("../whatsappCloud");
const data = require("../data");
const utils = require("../utils");
const Reminder = require("../models/Reminder");

async function sendWeeklyUpdate() {
  const week = utils.getPregnancyWeek();

  // Map week → Meta template
  const templateMap = {
    12: "pregnancy_week_12",
    13: "pregnancy_week_13",
    14: "pregnancy_week_14_v1",
    15: "pregnancy_week_15"
  };

  const templateName = templateMap[week];
  if (!templateName) return; // no template for this week

  const baby = data.BABY_IMAGES[week];
  if (!baby || !baby.image) return;

  // prevent duplicate send
  const alreadySent = await Reminder.findOne({
    type: "weekly",
    "data.week": week
  });
  if (alreadySent) return;

  await sendTemplate(data.USER, templateName, [
    {
      type: "header",
      parameters: [
        {
          type: "image",
          image: {
            link: baby.image
          }
        }
      ]
    },
    {
      type: "body",
      parameters: [
        { type: "text", text: data.NAME },        // {{1}}
        { type: "text", text: baby.size },        // {{2}}
        { type: "text", text: String(week) }      // {{3}}
      ]
    }
  ]);

  await Reminder.create({
    user: data.USER,
    type: "weekly",
    data: { week },
    sent: true,
    sentAt: new Date()
  });

  console.log("✅ Weekly update sent for week", week);
}

module.exports = { sendWeeklyUpdate };
