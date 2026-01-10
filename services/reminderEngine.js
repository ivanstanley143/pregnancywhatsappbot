const Reminder = require("../models/Reminder");
const data = require("../data");
const utils = require("../utils");
const {
  sendTextMessage,
  sendImageMessage
} = require("../whatsapp");

async function processReminders() {
  const now = new Date();

  while (true) {
    // 🔐 Atomic lock to prevent duplicate sends
    const reminder = await Reminder.findOneAndUpdate(
      { sent: false, scheduledAt: { $lte: now } },
      { sent: true, sentAt: new Date() }
    );

    if (!reminder) break;

    try {
      await dispatchReminder(reminder);
      console.log("✅ Sent:", reminder.type, "→", reminder.user);
    } catch (err) {
      console.error("❌ Send failed:", err.message);

      // 🔁 Rollback so it can retry later
      reminder.sent = false;
      reminder.sentAt = null;
      await reminder.save();
    }
  }
}

async function dispatchReminder(r) {
  switch (r.type) {

    case "water":
      return sendTextMessage(
        r.user,
        utils.format(
          "💧 Please drink water",
          "💧 ദയവായി വെള്ളം കുടിക്കൂ"
        )
      );

    case "meal":
      return sendTextMessage(
        r.user,
        utils.format(r.data.en, r.data.ml)
      );

    case "dua":
      return sendTextMessage(
        r.user,
        `🤲 Weekly Dua\n\n${data.WEEKLY_DUA[r.data.week] || ""}\n\n${data.DISCLAIMER}`
      );

    case "appointment":
      return sendTextMessage(
        r.user,
        utils.format(
          `📅 ${r.data.note}`,
          "📅 ഇന്ന് ഡോക്ടർ അപ്പോയിന്റ്മെന്റ്"
        )
      );

    case "week":
      // 🛡️ SAFE FALLBACK IF IMAGE IS MISSING
      if (!r.data.image) {
        return sendTextMessage(
          r.user,
          utils.format(
            `🤰 Week ${r.data.week}\nBaby growth update coming soon.`,
            `🤰 ${r.data.week} ആഴ്ച\nകുഞ്ഞിന്റെ വിവരങ്ങൾ ഉടൻ ലഭിക്കും`
          )
        );
      }

      return sendImageMessage(
        r.user,
        r.data.image,
        utils.format(
          `🤰 Week ${r.data.week}\nBaby size: ${r.data.size}`,
          `🤰 ${r.data.week} ആഴ്ച\nകുഞ്ഞിന്റെ വലുപ്പം: ${r.data.size}`
        )
      );

    case "trimester":
      return sendImageMessage(
        r.user,
        data.TRIMESTER_IMAGES[r.data.trimester],
        utils.format(
          `🌸 Trimester ${r.data.trimester} started`,
          `🌸 ട്രൈമെസ്റ്റർ ${r.data.trimester} ആരംഭിച്ചു`
        )
      );

    default:
      console.warn("⚠️ Unknown reminder type:", r.type);
  }
}

module.exports = { processReminders };
