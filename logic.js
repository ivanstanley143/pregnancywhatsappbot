const data = require("./data");
const { getPregnancyWeek, getTrimester } = require("./utils");

module.exports = async (text) => {
  const msg = text.toLowerCase().trim();
  const week = getPregnancyWeek();

  /* =========================
     🤲 DUA (HAS 2 VARIABLES)
     {{1}} = Name
     {{2}} = Dua text
  ========================== */
  if (msg.includes("dua")) {
    return {
      type: "template",
      template: "pregnancy_dua",
      params: [
        data.NAME, // {{1}}
        data.WEEKLY_DUA[week] ||
          "رَبِّي تَمِّمْ بِالْخَيْرِ Rabbi tammim bil khair" // {{2}}
      ]
    };
  }

  /* =========================
     🤰 WEEK
  ========================== */
  if (msg === "week" || msg.includes("baby")) {
    return {
      type: "template",
      template: `pregnancy_week_${week}`
    };
  }

  /* =========================
     🩺 TRIMESTER
  ========================== */
  if (msg.includes("trimester")) {
    const tri = getTrimester(week);
    return {
      type: "template",
      template: `pregnancy_trimester_${tri}`
    };
  }

  /* =========================
     🥗 SAFE
  ========================== */
  if (msg === "safe") {
    return {
      type: "template",
      template: "pregnancy_food_safe"
    };
  }

  /* =========================
     🚫 AVOID
  ========================== */
  if (msg === "avoid") {
    return {
      type: "template",
      template: "pregnancy_food_avoid"
    };
  }

  /* =========================
     ⚠️ LIMIT
  ========================== */
  if (msg === "limit") {
    return {
      type: "template",
      template: "pregnancy_food_limit"
    };
  }

  /* =========================
     🍎 SINGLE FOOD → CATEGORY
  ========================== */
  const key = msg.replace(/\s/g, "");
  const food = data.FOOD_DB[key];

  if (food) {
    return {
      type: "template",
      template:
        food.status === "SAFE"
          ? "pregnancy_food_safe"
          : food.status === "AVOID"
          ? "pregnancy_food_avoid"
          : "pregnancy_food_limit"
    };
  }

  return null;
};
