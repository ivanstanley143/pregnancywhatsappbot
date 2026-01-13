const data = require("./data");
const { getPregnancyWeek, getTrimester, format } = require("./utils");

module.exports = async (text) => {
  const msg = text.toLowerCase().trim();
  const week = getPregnancyWeek();

  if (msg.includes("dua")) {
    return format(`🤲 ${data.WEEKLY_DUA[week] || "Allahumma ihfaz waladana"}`);
  }

  if (msg.includes("week")) {
    const baby = data.BABY_IMAGES[week];
    return format(`🤰 Week ${week}\nBaby size: ${baby?.size || "Coming soon"}`);
  }

  if (msg.includes("trimester")) {
    return format(`🩺 You are in Trimester ${getTrimester(week)}`);
  }

  const key = msg.replace(/\s/g, "");
  const food = data.FOOD_DB[key];
  if (food) {
    return format(`${food.label}\n${food.status}\n${food.details}`);
  }

  if (msg === "safe") {
    return format("🥗 Safe Foods\n\n" +
      Object.values(data.FOOD_DB).filter(f=>f.status==="SAFE").map(f=>f.label).join("\n"));
  }

  if (msg === "avoid") {
    return format("🚫 Avoid Foods\n\n" +
      Object.values(data.FOOD_DB).filter(f=>f.status==="AVOID").map(f=>f.label).join("\n"));
  }

  if (msg === "limit") {
    return format("⚠️ Limit Foods\n\n" +
      Object.values(data.FOOD_DB).filter(f=>f.status==="LIMIT").map(f=>f.label).join("\n"));
  }

  return null;
};
