const data = require("./data");
const { getPregnancyWeek, getTrimester, format } = require("./utils");

module.exports = async (text) => {
  const msg = text.toLowerCase().trim();
  const week = getPregnancyWeek();

  /* =========================
     🤲 DUA
  ========================== */
  if (msg.includes("dua")) {
    return {
      type: "dua",
      text: data.WEEKLY_DUA[week] || "Allahumma ihfaz waladana"
    };
  }

  /* =========================
     🤰 WEEK (text only – image comes from weeklyEngine)
  ========================== */
  if (msg === "week" || msg.includes("baby")) {
    const baby = data.BABY_IMAGES[week];
    return {
      type: "text",
      text: `🤰 Week ${week}\nBaby size: ${baby?.size || "Coming soon"}`
    };
  }

  /* =========================
     🩺 TRIMESTER
  ========================== */
  if (msg.includes("trimester")) {
    const tri = getTrimester(week);
    return {
      type: "text",
      text: `🩺 You are in Trimester ${tri}`
    };
  }

  /* =========================
     🥗 SAFE FOODS
  ========================== */
  if (msg === "safe") {
    const list = Object.values(data.FOOD_DB)
      .filter(f => f.status === "SAFE")
      .map(f => f.label)
      .join("\n");

    return {
      type: "template",
      template: "pregnancy_safe_foods",
      params: [list]
    };
  }

  /* =========================
     🚫 AVOID FOODS
  ========================== */
  if (msg === "avoid") {
    const list = Object.values(data.FOOD_DB)
      .filter(f => f.status === "AVOID")
      .map(f => f.label)
      .join("\n");

    return {
      type: "template",
      template: "pregnancy_avoid_foods",
      params: [list]
    };
  }

  /* =========================
     ⚠️ LIMIT FOODS
  ========================== */
  if (msg === "limit") {
    const list = Object.values(data.FOOD_DB)
      .filter(f => f.status === "LIMIT")
      .map(f => f.label)
      .join("\n");

    return {
      type: "template",
      template: "pregnancy_limit_foods",
      params: [list]
    };
  }

  /* =========================
     🍎 SINGLE FOOD
  ========================== */
  const key = msg.replace(/\s/g, "");
  const food = data.FOOD_DB[key];

  if (food) {
    return {
      type: "text",
      text: `${food.label}\n${food.status}\n${food.details}`
    };
  }

  return null;
};
