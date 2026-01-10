const moment = require("moment-timezone");
const data = require("./data");

function now() {
  return moment().tz(data.TIMEZONE);
}

function getPregnancyWeek() {
  const lmp = moment(data.LMP);
  const days = now().diff(lmp, "days");
  return Math.max(1, Math.floor(days / 7) + 1);
}

function getTrimester(week) {
  if (week <= 12) return 1;
  if (week <= 27) return 2;
  return 3;
}

function format(en, ml = "") {
  return `Hi ${data.NAME} ❤️🤰🏻
Assalamu Alaikkum 🌸

${en}
${ml ? "\n\n" + ml : ""}

${data.FOOTER}`;
}

module.exports = { now, getPregnancyWeek, getTrimester, format };
