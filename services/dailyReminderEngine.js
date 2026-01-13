const Reminder = require("../models/Reminder");
const { sendTemplate } = require("../whatsappCloud");

async function processDailyReminders() {
  const list = await Reminder.find({
    sent: false,
    scheduledAt: { $lte: new Date() }
  });

  for (const r of list) {
    if (r.type === "water") {
      await sendTemplate(r.user, "pregnancy_water_reminder");
    }

    if (r.type === "meal") {
      await sendTemplate(r.user, "pregnancy_meal_reminder", [
        {
          type: "body",
          parameters: [
            { type: "text", text: r.data.title_en },
            { type: "text", text: r.data.title_ml }
          ]
        }
      ]);
    }

    r.sent = true;
    await r.save();
  }
}

module.exports = { processDailyReminders };
