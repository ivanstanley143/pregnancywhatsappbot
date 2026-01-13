const data = require("./data");
const { getPregnancyWeek, getTrimester, format } = require("./utils");

module.exports = async (text) => {
  const msg = text.toLowerCase().trim();
  const week = getPregnancyWeek();

  /* =========================
     🤲 DUA COMMAND
  ========================== */
  if (msg.includes("dua")) {
    const dua = data.WEEKLY_DUA[week] || "Allahumma ihfaz waladana";
    return format(`🤲 ${dua}`);
  }

  /* =========================
     📅 WEEK TEXT (image handled by weeklyEngine)
  ========================== */
  if (msg === "week" || msg.includes("baby")) {
    const baby = data.BABY_IMAGES[week];
    return format(`🤰 Week ${week}\nBaby size: ${baby?.size || "Coming soon"}`);
  }

  /* =========================
     🩺 TRIMESTER
  ========================== */
  if (msg.includes("trimester")) {
    const tri = getTrimester(week);
    return format(`🩺 You are in Trimester ${tri}`);
  }

  /* =========================
     🍎 SINGLE FOOD CHECK
  ========================== */
  const key = msg.replace(/\s/g, "");
  const food = data.FOOD_DB[key];

  if (food) {
    const icon =
      food.status === "SAFE"
        ? "🟢 SAFE"
        : food.status === "LIMIT"
        ? "🟡 LIMIT"
        : "🔴 AVOID";

    return format(
      `${food.label}\n${icon}\n${food.details}`
    );
  }

  /* =========================
     🟢 SAFE FOODS
  ========================== */
  if (msg === "safe") {
    return format(
      "🥗 Pregnancy Safe Foods\n\n" +
        Object.values(data.FOOD_DB)
          .filter(f => f.status === "SAFE")
          .map(f => f.label)
          .join("\n")
    );
  }

  /* =========================
     🔴 AVOID FOODS
  ========================== */
  if (msg === "avoid") {
    return format(
      "🚫 Foods to Avoid During Pregnancy\n\n" +
        Object.values(data.FOOD_DB)
          .filter(f => f.status === "AVOID")
          .map(f => f.label)
          .join("\n")
    );
  }

  /* =========================
     🟡 LIMIT FOODS
  ========================== */
  if (msg === "limit") {
    return format(
      "⚠️ Foods to Limit During Pregnancy\n\n" +
        Object.values(data.FOOD_DB)
          .filter(f => f.status === "LIMIT")
          .map(f => f.label)
          .join("\n")
    );
  }

  return null;
};
