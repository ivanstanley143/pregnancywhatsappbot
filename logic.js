const data = require("./data");

// 🔤 simple language detection (Malayalam)
function isMalayalam(text) {
  return /[\u0D00-\u0D7F]/.test(text);
}

// 📅 pregnancy week calculator
function getCurrentPregnancyWeek(lmp) {
  const lmpDate = new Date(lmp);
  const today = new Date();
  const diffDays = Math.floor(
    (today - lmpDate) / (1000 * 60 * 60 * 24)
  );
  return Math.floor(diffDays / 7) + 1;
}

module.exports = async (text) => {
  const msg = text.toLowerCase().trim();
  const malayalam = isMalayalam(text);

  // 📅 WEEK / BABY SIZE COMMAND
  if (
    msg === "week" ||
    msg === "weeks" ||
    msg.includes("current week") ||
    msg.includes("ആഴ്ച")
  ) {
    const week = getCurrentPregnancyWeek(data.LMP);
    const baby = data.BABY_IMAGES[week];

    if (!baby) {
      return `🤰 Pregnancy Week ${week}\n\nDetails will be available soon.`;
    }

    return {
      type: "image",
      image: baby.image,
      caption:
        `Hi ${data.NAME},\n` +
        `Assalamu Alaikkum 🌸\n\n` +

        `🤰 Week ${week}\n` +
        `Baby size: ${baby.size}\n\n` +

        `🤰 ${week} ആഴ്ച\n` +
        `കുഞ്ഞിന്റെ വലുപ്പം: ${baby.size}\n\n` +

        `${data.DISCLAIMER}`
    };
  }

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
