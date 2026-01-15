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
        String(data.NAME || "Mother"), // {{1}} Name
        String(duaText)                // {{2}} Dua
      ]
    };
  }

  /* =========================
     🤰 WEEK ({{1}} {{2}} {{3}})
     {{1}} = Name
     {{2}} = Baby size
     {{3}} = Week number
  ========================== */
  if (msg === "week" || msg.includes("baby")) {
    const baby = data.BABY_IMAGES[week];

    return {
      type: "template",
      template: `pregnancy_week_${week}`,
      params: [
        String(data.NAME || "Mother"),           // {{1}}
        String(baby?.size || "Growing"),          // {{2}}
        String(week)                              // {{3}}
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
