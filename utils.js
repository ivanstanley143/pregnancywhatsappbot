const moment = require("moment-timezone");
const data = require("./data");

// 🌍 Current time (IST by default)
exports.now = () =>
  moment().tz(process.env.TIMEZONE || "Asia/Kolkata");

// 🤰 Pregnancy week calculation
exports.getPregnancy = () => {
  const lmp = moment(data.LMP);
  const days = exports.now().diff(lmp, "days");
  return { week: Math.max(1, Math.floor(days / 7) + 1) };
};

// 🌸 Trimester from week
exports.getTrimester = (week) => {
  if (week <= 12) return 1;
  if (week <= 27) return 2;
  return 3;
};

// 📝 Message formatter (EN + ML)
exports.format = (en, ml) => {
  return `Hi ${data.NAME},
Assalamu Alaikkum 🌸

${en}
${ml}

${data.DISCLAIMER}`;
};

// ⏰ Create Date object for TODAY at HH:mm
exports.timeToday = (time) => {
  const [h, m] = time.split(":").map(Number);
  return exports
    .now()
    .hour(h)
    .minute(m)
    .second(0)
    .millisecond(0)
    .toDate();
};

// 📅 Combine YYYY-MM-DD + HH:mm → Date
exports.combineDateTime = (date, time) => {
  const [h, m] = time.split(":").map(Number);
  return moment(date)
    .hour(h)
    .minute(m)
    .second(0)
    .millisecond(0)
    .toDate();
};

// 📆 Start date of a pregnancy week
exports.weekStartDate = (week) => {
  return moment(data.LMP)
    .add(week - 1, "weeks")
    .startOf("day")
    .toDate();
};

// 🌸 Trimester start date
exports.trimesterStartDate = (trimester) => {
  const startWeek = trimester === 1 ? 1 : trimester === 2 ? 13 : 28;
  return exports.weekStartDate(startWeek);
};

// 📅 Next Friday at HH:mm (for weekly dua)
exports.nextFridayAt = (time) => {
  const [h, m] = time.split(":").map(Number);
  const now = exports.now();
  const friday = now.clone().day(5);

  if (friday.isSameOrBefore(now)) {
    friday.add(1, "week");
  }

  return friday
    .hour(h)
    .minute(m)
    .second(0)
    .millisecond(0)
    .toDate();
};
