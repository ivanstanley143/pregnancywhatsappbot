const cron = require("node-cron");
const data = require("../data");
const { sendTemplate } = require("../whatsappCloud");

let sentToday = {
  water: {},
  meal: {}
};

// Reset every midnight
cron.schedule("0 0 * * *", () => {
  sentToday = { water: {}, meal: {} };
  console.log("🔄 Daily reminder reset");
});

// Check every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const hhmm = now.toTimeString().slice(0, 5); // "HH:MM"

  /* 💧 WATER */
  if (
    data.WATER_TIMES.includes(hhmm) &&
    !sentToday.water[hhmm]
  ) {
    await sendTemplate(
      data.USER,
      "pregnancy_water_reminder_v1",
      []
    );

    sentToday.water[hhmm] = true;
    console.log("💧 Water reminder sent at", hhmm);
  }

  /* 🍽️ MEAL */
  if (
    data.MEALS[hhmm] &&
    !sentToday.meal[hhmm]
  ) {
    await sendTemplate(
      data.USER,
      "pregnancy_meal_reminder",
      [String(data.MEALS[hhmm])]
    );

    sentToday.meal[hhmm] = true;
    console.log("🍽️ Meal reminder sent at", hhmm);
  }
});
