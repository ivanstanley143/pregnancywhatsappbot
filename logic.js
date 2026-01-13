const data = require("./data");

function getWeek() {
  const diff = (new Date() - new Date(data.LMP)) / (1000*60*60*24);
  return Math.floor(diff / 7) + 1;
}

module.exports = async (text) => {
  const week = getWeek();

  if (text.toLowerCase().includes("dua")) {
    return data.WEEKLY_DUA[week] || "Allahumma ihfaz waladana";
  }

  if (text.toLowerCase().includes("week")) {
    const baby = data.BABY_IMAGES[week];
    return `Week ${week} – Baby size: ${baby?.size || "Coming soon"}`;
  }

  return null;
};
