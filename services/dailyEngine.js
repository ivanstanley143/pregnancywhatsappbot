const cron = require("node-cron");
const data = require("../data");
const { sendTemplate } = require("../whatsappCloud");

// WATER REMINDERS
data.WATER_TIMES.forEach(time => {
  const [h,m] = time.split(":");

  cron.schedule(`${m} ${h} * * *`, () => {
    sendTemplate(data.USER, "pregnancy_water_reminder_v1", []);
  });
});

// MEAL REMINDERS
Object.keys(data.MEALS).forEach(time => {
  const [h,m] = time.split(":");
  const meal = data.MEALS[time];

  cron.schedule(`${m} ${h} * * *`, () => {
    sendTemplate(data.USER, "pregnancy_meal_reminder", [
      meal[0],
      meal[1]
    ]);
  });
});
