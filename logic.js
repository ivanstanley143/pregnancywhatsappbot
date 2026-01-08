const data = require("./data");
const utils = require("./utils");

// 🔤 simple language detection (Malayalam)
function isMalayalam(text) {
  return /[\u0D00-\u0D7F]/.test(text);
}

module.exports = async (text) => {
  const msg = text.toLowerCase().trim();
  const malayalam = isMalayalam(text);

  // 🟢 SAFE FOODS LIST
  if (msg === "safe foods") {
    return {
      type: "image",
      image: data.SAFE_FOOD_IMAGE,
      caption: malayalam
        ? `🥗 ഗർഭകാലത്ത് സുരക്ഷിതമായ ഭക്ഷണങ്ങൾ\n\n${data.SAFE_FOODS.join(", ")}`
        : `🥗 Pregnancy Safe Foods\n\n${data.SAFE_FOODS.join(", ")}`
    };
  }

  // 🔴 AVOID FOODS LIST
  if (msg === "avoid foods") {
    return {
      type: "image",
      image: data.AVOID_FOOD_IMAGE,
      caption: malayalam
        ? `🚫 ഗർഭകാലത്ത് ഒഴിവാക്കേണ്ട ഭക്ഷണങ്ങൾ\n\n${data.AVOID_FOODS.join(", ")}`
        : `🚫 Foods to Avoid During Pregnancy\n\n${data.AVOID_FOODS.join(", ")}`
    };
  }

  // 🟡 LIMIT FOODS LIST
  if (msg === "limit foods") {
    return {
      type: "image",
      image: data.LIMIT_FOOD_IMAGE,
      caption: malayalam
        ? `⚠️ ഗർഭകാലത്ത് കുറയ്ക്കേണ്ട ഭക്ഷണങ്ങൾ\n\n${data.LIMIT_FOODS.join(", ")}`
        : `⚠️ Foods to Limit During Pregnancy\n\n${data.LIMIT_FOODS.join(", ")}`
    };
  }

  // 🍎 INDIVIDUAL FOOD CHECK
  for (const food in data.FOOD_DB) {
    if (msg.includes(food)) {
      return malayalam
        ? `🍎 ${food} : ${data.FOOD_DB[food]} (ഗർഭകാലത്ത്)`
        : `${food.toUpperCase()} : ${data.FOOD_DB[food]}`;
    }
  }

  return null;
};
