const data = require("./data");

// 🔤 simple language detection (Malayalam)
function isMalayalam(text) {
  return /[\u0D00-\u0D7F]/.test(text);
}

module.exports = async (text) => {
  const msg = text.toLowerCase().trim();
  const malayalam = isMalayalam(text);

  // 🟢 SAFE FOODS LIST (Bilingual title, English list)
  if (msg.includes("safe foods") || msg.includes("സേഫ്")) {
    return {
      type: "image",
      image: data.SAFE_FOOD_IMAGE,
      caption:
        "🥗 Pregnancy Safe Foods / ഗർഭകാലത്ത് സുരക്ഷിതമായ ഭക്ഷണങ്ങൾ\n\n" +
        data.SAFE_FOODS.join(", ")
    };
  }

  // 🔴 AVOID FOODS LIST (Bilingual title, English list)
  if (msg.includes("avoid foods") || msg.includes("ഒഴിവ")) {
    return {
      type: "image",
      image: data.AVOID_FOOD_IMAGE,
      caption:
        "🚫 Foods to Avoid During Pregnancy / ഗർഭകാലത്ത് ഒഴിവാക്കേണ്ട ഭക്ഷണങ്ങൾ\n\n" +
        data.AVOID_FOODS.join(", ")
    };
  }

  // 🟡 LIMIT FOODS LIST (Bilingual title, English list)
  if (msg.includes("limit foods") || msg.includes("കുറയ്")) {
    return {
      type: "image",
      image: data.LIMIT_FOOD_IMAGE,
      caption:
        "⚠️ Foods to Limit During Pregnancy / ഗർഭകാലത്ത് കുറയ്ക്കേണ്ട ഭക്ഷണങ്ങൾ\n\n" +
        data.LIMIT_FOODS.join(", ")
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
