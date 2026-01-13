const data = require("./data");

function getPregnancyWeek() {
  const diff = (new Date() - new Date(data.LMP)) / (1000 * 60 * 60 * 24);
  return Math.floor(diff / 7) + 1;
}

function getTrimester(week) {
  if (week <= 12) return 1;
  if (week <= 27) return 2;
  return 3;
}

function format(text) {
  return `${text}\n\n${data.FOOTER}`;
}

module.exports = { getPregnancyWeek, getTrimester, format };
