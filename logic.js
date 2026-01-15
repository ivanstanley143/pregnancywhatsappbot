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
        String(data.NAME || "Mother"), // {{1}}
        String(duaText)                // {{2}}
      ]
    };
  }

  /* =========================
     🤰 WEEK ({{1}} {{2}} {{3}})
     Applies to week 13 / 14 / 15
  ========================== */
  if (msg === "week" || msg.includes("baby")) {
    const baby = data.BABY_IMAGES[week];

    return {
      type: "template",
      template: `pregnancy_week_${week}`,
      params: [
        `Week ${week}`,                              // {{1}}
        baby?.size || "Growing beautifully",         // {{2}}
        "Your baby is developing well 💕"            // {{3}}
      ]
    };
  }

  /* =========================
     🩺 TRIMESTER (already correct)
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
     (routes to 1-variable templates)
  ========================== */
  const key = msg.replace(/\s/g, "");
  const food = data.FOOD_DB[key];

  if (food) {
    if (food.status === "SAFE") {
      return {
        type: "template",
        template: "pregnancy_food_safe",
        params: [
          "Fruits, vegetables, milk, eggs, nuts and whole grains"
        ]
      };
    }

    if (food.status === "AVOID") {
      return {
        type: "template",
        template: "pregnancy_food_avoid",
        params: [
          "Papaya, pineapple, alcohol and raw meat"
        ]
      };
    }

    if (food.status === "LIMIT") {
      return {
        type: "template",
        template: "pregnancy_food_limit",
        params: [
          "Coffee, tea, sugar and junk food"
        ]
      };
    }
  }

  return null;
};
