const data = require("./data");

// simple language detection
function isMalayalam(text) {
  return /[\u0D00-\u0D7F]/.test(text);
}

module.exports = async (text) => {
  const msg = text.toLowerCase().trim();
  const malayalam = isMalayalam(text);

  // 🍎 FOOD CHECK
  for (const food in data.FOOD_DB) {
    if (msg.includes(food)) {
      return malayalam
        ? `🍎 ${food} : ${data.FOOD_DB[food]} (ഗർഭകാലത്ത്)`
        : `${food.toUpperCase()} : ${data.FOOD_DB[food]}`;
    }
  }

  if (msg === "safe foods") {
    return {
      type: "image",
      image: data.SAFE_FOOD_IMAGE,
      caption: malayalam
        ? "🥗 ഗർഭകാലത്ത് സുരക്ഷിതമായ ഭക്ഷണങ്ങൾ"
        : "🥗 Pregnancy safe foods"
    };
  }

  if (msg === "avoid foods") {
    return {
      type: "image",
      image: data.AVOID_FOOD_IMAGE,
      caption: malayalam
        ? "🚫 ഗർഭകാലത്ത് ഒഴിവാക്കേണ്ട ഭക്ഷണങ്ങൾ"
        : "🚫 Foods to avoid during pregnancy"
    };
  }

  if (msg === "limit foods") {
    return {
      type: "image",
      image: data.LIMIT_FOOD_IMAGE,
      caption: malayalam
        ? "⚠️ ഗർഭകാലത്ത് കുറയ്ക്കേണ്ട ഭക്ഷണങ്ങൾ"
        : "⚠️ Foods to limit during pregnancy"
    };
  }

  return null;
};
