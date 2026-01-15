const cron = require("node-cron");
const data = require("../data");
const { sendTemplate } = require("../whatsappCloud");

/* ================================
   💧 WATER REMINDERS (NO VARIABLES)
================================ */
data.WATER_TIMES.forEach(time => {
  const [h, m] = time.split(":");

  cron.schedule(`${m} ${h} * * *`, () => {
    sendTemplate(
      data.USER,
      "pregnancy_water_reminder_v1",
      []
    );
  });
});

/* ================================
   🍽️ MEAL REMINDERS ({{1}})
================================ */
Object.entries(data.MEALS).forEach(([time, meal]) => {
  const [h, m] = time.split(":");

  cron.schedule(`${m} ${h} * * *`, () => {
    sendTemplate(
      data.USER,
      "pregnancy_meal_reminder",
      [
        String(meal) // {{1}}
      ]
    );
  });
});
