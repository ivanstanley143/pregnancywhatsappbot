const cron = require("node-cron");
const { sendTemplate } = require("../whatsappCloud");
const data = require("../data");
const { getTrimester } = require("../utils");

// Check daily at 8am
cron.schedule("0 8 * * *", () => {
  const trimester = getTrimester();
  const img = data.TRIMESTER_IMAGES[trimester];
  if (!img) return;

  sendTemplate(data.USER, "pregnancy_trimester", [
    String(trimester)
  ]);
});
