const data = require("./data");

// 🔤 Detect Malayalam text
function isMalayalam(text) {
  return /[\u0D00-\u0D7F]/.test(text);
}

// 📅 Pregnancy week calculation
function getCurrentPregnancyWeek(lmp) {
  const lmpDate = new Date(lmp);
  const today = new Date();
  const diffDays = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.floor(diffDays / 7) + 1);
}

// 🤰 Trimester calculation
function getTrimester(week) {
  if (week <= 12) return 1;
  if (week <= 27) return 2;
  return 3;
}

// 📌 Footer (always shown)
const FOOTER = `\n\n${data.FOOTER}`;

module.exports = async (text) => {
  const msg = text.toLowerCase().trim();
  const normalized = msg.replace(/\s/g, "");
  const malayalam = isMalayalam(text);

  const week = getCurrentPregnancyWeek(data.LMP);
  const trimester = getTrimester(week);

  /* ==========================
     🤲 DUA COMMAND
  ========================== */
  if (msg === "dua" || msg.includes("dua") || msg.includes("ദുആ")) {
    const dua =
      data.WEEKLY_DUA[week] ||
      "🤲 Allahumma ahfaz waladana wa ummahu bi rahmatika";

    return (
      `Hi ${data.NAME} ❤️🤰🏻\n` +
      `Assalamu Alaikkum 🌸\n\n` +
      `🤲 Dua for Week ${week}\n\n` +
      dua +
      "\n\n" + data.FOOTER
    );
  }

  /* ==========================
     🤰 WEEK / BABY SIZE
  ========================== */
  if (
    msg === "week" ||
    msg === "weeks" ||
    msg.includes("current week") ||
    msg.includes("ആഴ്ച")
  ) {
    const baby = data.BABY_IMAGES[week];

    if (!baby || !baby.image) {
      return (
        `Hi ${data.NAME} ❤️🤰🏻\n` +
        `Assalamu Alaikkum 🌸\n\n` +
        `🤰 Pregnancy Week ${week}\n\nDetails will be available soon.` +
        "\n\n" + data.FOOTER
      );
    }

    return {
      type: "image",
      image: baby.image,
      caption:
        `Hi ${data.NAME} ❤️🤰🏻\n` +
        `Assalamu Alaikkum 🌸\n\n` +
        `🤰 Week ${week}\n` +
        `Baby size: ${baby.size}\n\n` +
        `🤰 ${week} ആഴ്ച\n` +
        `കുഞ്ഞിന്റെ വലുപ്പം: ${baby.size}` +
        "\n\n" + data.FOOTER
    };
  }

  /* ==========================
     🌸 TRIMESTER
  ========================== */
  if (msg.includes("trimester") || msg.includes("ത്രൈമാസം")) {
    const img = data.TRIMESTER_IMAGES[trimester];

    return {
      type: "image",
      image: img,
      image: data.TRIMESTER_IMAGES[trimester]?.image,
      caption:
        `Hi ${data.NAME} ❤️🤰🏻\n` +
        `Assalamu Alaikkum 🌸\n\n` +
        `🌸 Trimester ${trimester}\n\n` +
        (trimester === 1
          ? "First Trimester / ആദ്യ ത്രൈമാസം"
          : trimester === 2
          ? "Second Trimester / രണ്ടാം ത്രൈമാസം"
          : "Third Trimester / മൂന്നാം ത്രൈമാസം") +
        "\n\n" + data.FOOTER
    };
  }

  /* ==========================
     📅 APPOINTMENTS (COMMAND)
  ========================== */
  if (msg.includes("appointment") || msg.includes("ഡോക്ടർ")) {
    if (!data.APPOINTMENTS.length) {
      return (
        `Hi ${data.NAME} ❤️🤰🏻\n` +
        `Assalamu Alaikkum 🌸\n\n` +
        `📅 No upcoming appointments.` +
        "\n\n" + data.FOOTER
      );
    }

    let reply =
      `Hi ${data.NAME} ❤️🤰🏻\n` +
      `Assalamu Alaikkum 🌸\n\n` +
      `📅 Upcoming Appointments\n\n`;

    for (const a of data.APPOINTMENTS) {
      reply +=
        `🩺 ${a.note}\n` +
        `📆 ${a.date}\n` +
        `⏰ ${a.time}\n\n`;
    }

    return reply.trim() + "\n\n" + data.FOOTER;
  }

  /* ==========================
     🟢 SAFE / 🔴 AVOID / 🟡 LIMIT LISTS
  ========================== */
  if (msg === "safe") {
    const list = Object.values(data.FOOD_DB)
      .filter(f => f.status === "SAFE")
      .map(f => `• ${f.label}`)
      .join("\n");

    return (
      `Hi ${data.NAME} ❤️🤰🏻\n` +
      `Assalamu Alaikkum 🌸\n\n` +
      `🥗 Pregnancy Safe Foods\n\n` +
      list +
      data.FOOTER
    );
  }

  if (msg === "avoid") {
    const list = Object.values(data.FOOD_DB)
      .filter(f => f.status === "AVOID")
      .map(f => `• ${f.label}`)
      .join("\n");

    return (
      `Hi ${data.NAME} ❤️🤰🏻\n` +
      `Assalamu Alaikkum 🌸\n\n` +
      `🚫 Foods to Avoid During Pregnancy\n\n` +
      list +
      data.FOOTER
    );
  }

  if (msg === "limit") {
    const list = Object.values(data.FOOD_DB)
      .filter(f => f.status === "LIMIT")
      .map(f => `• ${f.label}`)
      .join("\n");

    return (
      `Hi ${data.NAME} ❤️🤰🏻\n` +
      `Assalamu Alaikkum 🌸\n\n` +
      `⚠️ Foods to Limit During Pregnancy\n\n` +
      list +
      data.FOOTER
    );
  }

  /* ==========================
     🍎 SINGLE FOOD CHECK
  ========================== */
  const food = data.FOOD_DB[normalized];
  if (food) {
    const statusEmoji =
      food.status === "SAFE"
        ? "🟢 SAFE"
        : food.status === "LIMIT"
        ? "🟡 LIMIT"
        : "🔴 AVOID";

    return (
      `Hi ${data.NAME} ❤️🤰🏻\n` +
      `Assalamu Alaikkum 🌸\n\n` +
      `${food.label}\n\n` +
      `${statusEmoji}\n` +
      `${food.details}` +
      data.FOOTER
    );
  }

  // ❌ Unknown command
  return null;
};
