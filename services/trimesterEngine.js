const cron = require("node-cron");
const Reminder = require("../models/Reminder");
const data = require("../data");
const { sendTemplate } = require("../whatsappCloud");

/* ================================
   Pregnancy Calculations
================================ */
function getPregnancyWeek() {
  const diff =
    (new Date() - new Date(data.LMP)) / (1000 * 60 * 60 * 24);
  return Math.floor(diff / 7) + 1;
}

function getTrimester(week) {
  if (week <= 12) return 1;
  if (week <= 27) return 2;
  return 3;
}

/* ================================
   Main Trimester Sender
================================ */
async function processTrimesterChange() {
  try {
    const week = getPregnancyWeek();
    const trimester = getTrimester(week);

    // Check if this trimester already sent
    const exists = await Reminder.findOne({
      user: data.USER,
      type: "trimester",
      "data.trimester": trimester
    });

    if (exists) return;

    // Select correct Meta template
    let templateName = "";
    if (trimester === 1) templateName = "pregnancy_trimester_1";
    if (trimester === 2) templateName = "pregnancy_trimester_2";
    if (trimester === 3) templateName = "pregnancy_trimester_3";

    if (!templateName) return;

    // Send template (image + caption)
    await sendTemplate(data.USER, templateName);

    // Save lock to DB
    await Reminder.create({
      user: data.USER,
      type: "trimester",
      data: { trimester },
      sent: true
    });

    console.log("🌸 Trimester", trimester, "message sent");
  } catch (err) {
    console.error("Trimester Engine Error:", err.message);
  }
}

/* ================================
   Auto Run Every Day
================================ */
cron.schedule("0 11 * * *", () => {
  processTrimesterChange();
});

/* ================================
   Export for manual trigger
================================ */
module.exports = { processTrimesterChange };
