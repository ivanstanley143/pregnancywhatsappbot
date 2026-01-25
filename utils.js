const data = require("./data");

/* =========================
   🤰 PREGNANCY WEEK CALCULATOR
========================= */
function getPregnancyWeek() {
  const lmp = new Date(data.LMP);
  const now = new Date();

  // Safety: invalid LMP
  if (isNaN(lmp.getTime())) return 1;

  const diffDays = (now - lmp) / (1000 * 60 * 60 * 24);
  let week = Math.floor(diffDays / 7) + 1;

  // Safety: negative or zero weeks
  if (week < 1) week = 1;
  if (week > 42) week = 42; // medical max pregnancy weeks

  return week;
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
   (Medical pregnancy months)
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
