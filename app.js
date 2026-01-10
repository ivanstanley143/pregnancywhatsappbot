require("dotenv").config();
const cron = require("node-cron");
const connectDB = require("./db");

const { sendWeeklyUpdate } = require("./services/weeklyEngine");
const { processBabyGrowth } = require("./services/babyGrowthEngine");
const { processTrimesterChange } = require("./services/trimesterEngine");
const { seedDailyReminders } = require("./services/dailyReminderSeeder");
const { processDailyReminders } = require("./services/dailyReminderEngine");
const { processAppointmentReminders } = require("./services/appointmentEngine");
const { sendWeeklyDua, sendDailyDua } = require("./services/duaEngine");

(async () => {
  await connectDB();

  seedDailyReminders();
  setInterval(processDailyReminders, 60 * 1000);
  setInterval(processAppointmentReminders, 60 * 1000);

  cron.schedule("0 9 * * 1", sendWeeklyUpdate);
  cron.schedule("0 10 * * *", processBabyGrowth);
  cron.schedule("0 11 * * *", processTrimesterChange);
  cron.schedule("0 9 * * 5", sendWeeklyDua);

  console.log("🚀 Pregnancy WhatsApp Bot running");
})();
