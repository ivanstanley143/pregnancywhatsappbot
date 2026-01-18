const data = require("./data");
const { getPregnancyWeek, getTrimester } = require("./utils");
const Reminder = require("./models/Reminder");

module.exports = async (text, from) => {
  const msg = text.toLowerCase().trim();
  const week = getPregnancyWeek();

  /* =========================
     ➕ ADD APPOINTMENT
     Command:
     add appointment DD-MM-YYYY HH:MM Note
  ========================== */
  if (msg.startsWith("add appointment")) {
    const parts = msg.split(" ");

    if (parts.length < 5) {
      return {
        type: "text",
        text:
          "❌ Invalid format.\n\n" +
          "Use:\nadd appointment DD-MM-YYYY HH:MM Note\n\n" +
          "Example:\nadd appointment 20-01-2026 10:30 Doctor visit"
      };
    }

    const dateStr = parts[2];
    const timeStr = parts[3];
    const note = parts.slice(4).join(" ");

    const [day, month, year] = dateStr.split("-");
    const [hour, minute] = timeStr.split(":");

    const scheduledAt = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute)
    );

    if (isNaN(scheduledAt.getTime())) {
      return {
        type: "text",
        text: "❌ Invalid date or time."
      };
    }

    await Reminder.create({
      user: data.USER,
      type: "appointment",
      sent: false,
      scheduledAt,
      data: {
        date: scheduledAt.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric"
        }),
        time: scheduledAt.toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit"
        }),
        note
      }
    });

    return {
      type: "text",
      text:
        "✅ Appointment added successfully.\n\n" +
        `📅 ${dateStr}\n` +
        `⏰ ${timeStr}\n` +
        `📝 ${note}`
    };
  }

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
        String(data.NAME),
        String(duaText)
      ]
    };
  }

  /* =========================
     🤰 WEEK ({{1}} {{2}} {{3}})
     ✅ FIXED WITH TEMPLATE MAP
  ========================== */
  if (msg === "week" || msg.includes("baby")) {
    const baby = data.BABY_IMAGES[week];
    if (!baby) {
      return {
        type: "text",
        text: `ℹ️ Week ${week} update will be available soon.`
      };
    }

    const weekTemplateMap = {
      12: "pregnancy_week_12",
      13: "pregnancy_week_13",
      14: "pregnancy_week_14_v1", // ✅ IMPORTANT FIX
      15: "pregnancy_week_15"
    };

    const templateName = weekTemplateMap[week];
    if (!templateName) {
      return {
        type: "text",
        text: `ℹ️ Week ${week} update will be available soon.`
      };
    }

    return {
      type: "template",
      template: templateName,
      params: [
        String(data.NAME),     // {{1}}
        String(baby.size),     // {{2}}
        String(week)           // {{3}}
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
     📅 APPOINTMENT (VIEW NEXT)
  ========================== */
  if (msg === "appointment") {
    const now = new Date();

    const next = await Reminder.findOne({
      type: "appointment",
      scheduledAt: { $gte: now }
    }).sort({ scheduledAt: 1 });

    if (!next) {
      return {
        type: "text",
        text: "🩺 No upcoming appointments found."
      };
    }

    return {
      type: "template",
      template: "pregnancy_appointment",
      params: [
        String(next.data.date),
        String(next.data.time),
        String(next.data.note)
      ]
    };
  }

  /* =========================
     🥗 SAFE
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
     🚫 AVOID
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
     ⚠️ LIMIT
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
     🍎 SINGLE FOOD
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
      params: [food.details]
    };
  }

  return null;
};
