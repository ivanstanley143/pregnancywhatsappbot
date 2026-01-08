const data = require("./data");

// 🔤 Malayalam detection
function isMalayalam(text) {
  return /[\u0D00-\u0D7F]/.test(text);
}

// 📅 Pregnancy week calculator
function getCurrentPregnancyWeek(lmp) {
  const lmpDate = new Date(lmp);
  const today = new Date();
  const diffDays = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7) + 1;
}

// 🤰 Trimester calculator
function getTrimester(week) {
  if (week <= 12) return 1;
  if (week <= 27) return 2;
  return 3;
}

// 📌 Common footer (ALWAYS shown)
const FOOTER = `\n\n${data.DISCLAIMER}`;

module.exports = async (text) => {
  const msg = text.toLowerCase().trim();
  const malayalam = isMalayalam(text);

  const week = getCurrentPregnancyWeek(data.LMP);
  const trimester = getTrimester(week);

  // 🤲 WEEKLY DUA
  if (msg === "dua" || msg.includes("dua")) {
    const dua =
      data.WEEKLY_DUA[week] ||
      "🤲 Keep making dua for a healthy pregnancy.";

    return (
      `🤲 Dua for Week ${week}\n\n` +
      `${dua}` +
      FOOTER
    );
  }

  // 🤰 TRIMESTER
  if (msg.includes("trimester")) {
    return {
      type: "image",
      image: data.TRIMESTER_IMAGES[trimester],
      caption:
        `🤰 ${
          trimester === 1
            ? "First Trimester / ആദ്യ ത്രൈമാസം"
            : trimester === 2
            ? "Second Trimester / രണ്ടാം ത്രൈമാസം"
            : "Third Trimester / മൂന്നാം ത്രൈമാസം"
        }` + FOOTER
    };
  }

  // 📅 APPOINTMENTS
  if (msg.includes("appointment")) {
    if (!data.APPOINTMENTS.length) {
      return "📅 No upcoming appointments scheduled." + FOOTER;
    }

    let reply = "📅 Upcoming Appointments\n\n";
    for (const appt of data.APPOINTMENTS) {
      reply +=
        `🩺 ${appt.note}\n` +
        `📆 ${appt.date}\n` +
        `⏰ ${appt.time}\n\n`;
    }

    return reply.trim() + FOOTER;
  }

  // 📅 WEEK / BABY SIZE
  if (
    msg === "week" ||
    msg === "weeks" ||
    msg.includes("current week") ||
    msg.includes("ആഴ്ച")
  ) {
    const baby = data.BABY_IMAGES[week];

    if (!baby) {
      return `🤰 Pregnancy Week ${week}\n\nDetails will be available soon.` + FOOTER;
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
        `കുഞ്ഞിന്റെ വലുപ്പം: ${baby.size}` +
        FOOTER
    };
  }

  // 🟢 SAFE FOODS
  if (msg.includes("safe foods") || msg.includes("സേഫ്")) {
    return {
      type: "image",
      image: data.SAFE_FOOD_IMAGE,
      caption:
        "🥗 Pregnancy Safe Foods / ഗർഭകാലത്ത് സുരക്ഷിതമായ ഭക്ഷണങ്ങൾ\n\n" +
        data.SAFE_FOODS.join(", ") +
        FOOTER
    };
  }

  // 🔴 AVOID FOODS
  if (msg.includes("avoid foods") || msg.includes("ഒഴിവ")) {
    return {
      type: "image",
      image: data.AVOID_FOOD_IMAGE,
      caption:
        "🚫 Foods to Avoid During Pregnancy / ഗർഭകാലത്ത് ഒഴിവാക്കേണ്ട ഭക്ഷണങ്ങൾ\n\n" +
        data.AVOID_FOODS.join(", ") +
        FOOTER
    };
  }

  // 🟡 LIMIT FOODS
  if (msg.includes("limit foods") || msg.includes("കുറയ്")) {
    return {
      type: "image",
      image: data.LIMIT_FOOD_IMAGE,
      caption:
        "⚠️ Foods to Limit During Pregnancy / ഗർഭകാലത്ത് കുറയ്ക്കേണ്ട ഭക്ഷണങ്ങൾ\n\n" +
        data.LIMIT_FOODS.join(", ") +
        FOOTER
    };
  }

  // 🍎 INDIVIDUAL FOOD CHECK
  for (const food in data.FOOD_DB) {
    if (msg.includes(food)) {
      const reply = malayalam
        ? `🍎 ${food} : ${data.FOOD_DB[food]} (ഗർഭകാലത്ത്)`
        : `${food.toUpperCase()} : ${data.FOOD_DB[food]}`;

      return reply + FOOTER;
    }
  }

  return null;
};
