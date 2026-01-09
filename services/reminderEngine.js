const Reminder = require("../models/Reminder");
const data = require("../data");
const utils = require("../utils");
const {
  sendTextMessage,
  sendImageMessage,
  getConnectionStatus
} = require("../whatsapp");

async function processReminders() {
  if (!getConnectionStatus()) {
    console.log("⚠️ WhatsApp not connected. Skipping reminder check.");
    return;
  }

  const now = new Date();

  const reminders = await Reminder.find({
    sent: false,
    scheduledAt: { $lte: now }
  });

  for (const r of reminders) {
    try {
      await dispatchReminder(r);
      r.sent = true;
      r.sentAt = new Date();
      await r.save();
    } catch (err) {
      console.error("❌ Failed to send reminder:", err);
    }
  }
}

async function dispatchReminder(r) {
  switch (r.type) {

    // 💧 Water
    case "water":
      return sendTextMessage(
        r.user,
        utils.format(
          "💧 Please drink water",
          "💧 ദയവായി വെള്ളം കുടിക്കൂ"
        )
      );

    // 🍽 Meals
    case "meal":
      return sendTextMessage(
        r.user,
        utils.format(r.data.en, r.data.ml)
      );

    // 🤲 Weekly Dua
    case "dua":
      return sendTextMessage(
        r.user,
        `🤲 Weekly Dua\n\n${data.WEEKLY_DUA[r.data.week]}\n\n${data.DISCLAIMER}`
      );

    // 📅 Appointment
    case "appointment":
      return sendTextMessage(
        r.user,
        utils.format(
          `📅 ${r.data.note}`,
          "📅 ഇന്ന് ഡോക്ടർ അപ്പോയിന്റ്മെന്റ്"
        )
      );

    // 🤰 Pregnancy Week
    case "week":
      return sendImageMessage(
        r.user,
        r.data.image,
        utils.format(
          `🤰 Week ${r.data.week}\nBaby size: ${r.data.size}`,
          `🤰 ${r.data.week} ആഴ്ച\nകുഞ്ഞിന്റെ വലുപ്പം: ${r.data.size}`
        )
      );

    // 🌸 Trimester
    case "trimester":
      return sendImageMessage(
        r.user,
        data.TRIMESTER_IMAGES[r.data.trimester],
        utils.format(
          `🌸 Trimester ${r.data.trimester} started`,
          `🌸 ട്രൈമെസ്റ്റർ ${r.data.trimester} ആരംഭിച്ചു`
        )
      );
  }
}

module.exports = { processReminders };
