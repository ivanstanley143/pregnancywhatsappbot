const data = require("./data");
const { getPregnancyWeek, getTrimester } = require("./utils");

module.exports = async (text) => {
  const msg = text.toLowerCase().trim();
  const week = getPregnancyWeek();

  /* =========================
     🤲 DUA ({{1}} {{2}})
  ========================== */
  if (msg.includes("dua")) {
    const duaText =
      data.WEEKLY_DUA[week] ??
      "رَبِّي تَمِّمْ بِالْخَيْرِ Rabbi tammim bil khair";

    return {
      type: "template",
      template: "pregnancy_dua",
      params: [
        String(data.NAME),     // {{1}}
        String(duaText)        // {{2}}
      ]
    };
  }

  /* =========================
     🤰 WEEK ({{1}} {{2}} {{3}})
  ========================== */
  if (msg === "week" || msg.includes("baby")) {
    const baby = data.BABY_IMAGES[week];

    if (!baby) return null;

    return {
      type: "template",
      template: `pregnancy_week_${week}`,
      params: [
        String(data.NAME),         // {{1}}
        String(baby.size),         // {{2}}
        String(week)               // {{3}}
      ]
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
     🥗 SAFE ({{1}})
  ========================== */
  if (msg === "safe") {
    return {
      type: "template",
      template: "pregnancy_food_safe",
      params: [
        "Fruits, vegetables, milk, eggs, nuts and whole grains"
      ]
    };
  }

  /* =========================
     🚫 AVOID ({{1}})
  ========================== */
  if (msg === "avoid") {
    return {
      type: "template",
      template: "pregnancy_food_avoid",
      params: [
        "Papaya, pineapple, alcohol, raw meat and unpasteurized food"
      ]
    };
  }

  /* =========================
     ⚠️ LIMIT ({{1}})
  ========================== */
  if (msg === "limit") {
    return {
      type: "template",
      template: "pregnancy_food_limit",
      params: [
        "Coffee, tea, sugar, soft drinks and junk food"
      ]
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
          : "pregnancy_food_limit",
      params: [
        food.details
      ]
    };
  }

  return null;
};
