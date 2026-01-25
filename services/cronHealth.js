const cron = require("node-cron");

cron.schedule("* * * * *", () => {
  console.log("🧠 CRON alive:", new Date().toISOString());
});
