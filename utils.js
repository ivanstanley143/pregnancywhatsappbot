const data = require("./data");

/* =========================
   🤰 PREGNANCY WEEK CALCULATOR
========================= */
function getPregnancyWeek() {
  const diff = (new Date() - new Date(data.LMP)) / (1000 * 60 * 60 * 24);
  return Math.floor(diff / 7) + 1;
}

/* =========================
   🩺 TRIMESTER CALCULATOR
========================= */
function getTrimester(week) {
  if (week <= 12) return 1;
  if (week <= 27) return 2;
  return 3;
}

/* =========================
   📅 PREGNANCY MONTH CALCULATOR
========================= */
function getPregnancyMonth(week) {
  if (week <= 4) return 1;
  if (week <= 8) return 2;
  if (week <= 13) return 3;
  if (week <= 17) return 4;
  if (week <= 22) return 5;
  if (week <= 27) return 6;
  if (week <= 31) return 7;
  if (week <= 35) return 8;
  return 9;
}

/* =========================
   📝 FORMAT FOOTER TEXT
========================= */
function format(text) {
  return `${text}\n\n${data.FOOTER}`;
}

module.exports = {
  getPregnancyWeek,
  getTrimester,
  getPregnancyMonth,
  format
};
