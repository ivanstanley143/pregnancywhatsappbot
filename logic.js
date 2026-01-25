const data = require("./data");
const { getPregnancyWeek, getTrimester, getPregnancyMonth } = require("./utils");
const Reminder = require("./models/Reminder");
const { getTodayPrayerTimes } = require("./services/athaanService");

module.exports = async (text, from) => {
  const msg = String(text || "").toLowerCase().trim();
  const week = getPregnancyWeek();

  /* =========================   
     🧪 TEST ATHAAN COMMAND
  ========================== */
  if (msg === "test athaan") {
    return {
      type: "template",
      template: "athaan_reminder",
      params: ["Fajr"]
    };
  }

  /* =========================
     🕌 AZAAN / ATHAAN TIMETABLE
  ========================== */
  if (msg === "athaan" || msg === "azaan") {
    try {
      const times = await getTodayPrayerTimes();

      if (!times || !times.Fajr || !times.Sunrise || !times.Dhuhr || !times.Asr || !times.Maghrib || !times.Isha) {
        return { type: "text", text: "🕌 Prayer times not available. Try later." };
      }

      return {
        type: "template",
        template: "athaan_daily_timetable",
        params: [
          String(times.Fajr),
          String(times.Sunrise),
          String(times.Dhuhr),
          String(times.Asr),
          String(times.Maghrib),
          String(times.Isha)
        ]
      };
    } catch (err) {
      console.error("Athaan error:", err.message);
      return { type: "text", text: "🕌 Failed to fetch prayer times." };
    }
  }

  /* =========================
     ➕ ADD APPOINTMENT
  ========================== */
  if (msg.startsWith("add appointment")) {
    const parts = msg.split(" ");

    if (parts.length < 5) {
      return {
        type: "text",
        text:
          "❌ Format:\nadd appointment DD-MM-YYYY HH:MM Note\n\nExample:\nadd appointment 20-01-2026 10:30 Doctor visit"
      };
    }

    const dateStr = parts[2];
    const timeStr = parts[3];
    const note = parts.slice(4).join(" ");

    const [day, month, year] = dateStr.split("-").map(Number);
    const [hour, minute] = timeStr.split(":").map(Number);

    const scheduledAt = new Date(year, month - 1, day, hour, minute);

    if (isNaN(scheduledAt.getTime())) {
      return { type: "text", text: "❌ Invalid date or time." };
    }

    await Reminder.create({
      user: data.USER,
      type: "appointment",
      sent: false,
      scheduledAt,
      data: {
        date: scheduledAt.toLocaleDateString("en-IN"),
        time: scheduledAt.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
        note
      }
    });

    return {
      type: "text",
      text: `✅ Appointment added\n📅 ${dateStr}\n⏰ ${timeStr}\n📝 ${note}`
    };
  }

  /* =========================
     📅 VIEW NEXT APPOINTMENT
  ========================== */
  if (msg === "appointment") {
    const next = await Reminder.findOne({
      type: "appointment",
      scheduledAt: { $gte: new Date() }
    }).sort({ scheduledAt: 1 });

    if (!next) return { type: "text", text: "🩺 No upcoming appointments." };

    return {
      type: "template",
      template: "pregnancy_appointment",
      params: [next.data.date, next.data.time, next.data.note]
    };
  }

  /* =========================
     🤲 DUA
  ========================== */
  if (msg.includes("dua")) {
    const duaText = data.WEEKLY_DUA[week] || "رَبِّي يَسِّرْ وَلَا تُعَسِّرْ وَتَمِّمْ بِالْخَيْرِ Rabbi yassir wala tu’assir wa tammim bil khair";
    return {
      type: "template",
      template: "pregnancy_dua",
      params: [String(data.NAME), String(duaText)]
    };
  }

  /* =========================
     🤰 WEEK UPDATE
  ========================== */
  if (msg === "week" || msg.includes("baby")) {
    const baby = data.BABY_IMAGES[week];

    const weekTemplateMap = {
      12: "pregnancy_week_12",
      13: "pregnancy_week_13",
      14: "pregnancy_week_14_v1",
      15: "pregnancy_week_15",
      16: "pregnancy_week_16",
      17: "pregnancy_week_17_v1",
      18: "pregnancy_week_18",
      19: "pregnancy_week_19",
      20: "pregnancy_week_20"
    };

    const templateName = weekTemplateMap[week];
    if (!baby || !templateName) {
      return { type: "text", text: `Week ${week} update coming soon.` };
    }

    return {
      type: "template",
      template: templateName,
      params: [String(data.NAME), String(baby.size), String(week)]
    };
  }

  /* =========================
     📅 MONTH UPDATE
  ========================== */
  if (msg === "month") {
    const month = getPregnancyMonth(week);

    // Prevent template errors
    if (month < 1 || month > 9) {
      return { type: "text", text: "Month update not available yet." };
    }

    return {
      type: "template",
      template: `pregnancy_month_${month}`,
      params: [String(data.NAME), String(month)]
    };
  }

  /* =========================
     🩺 TRIMESTER
  ========================== */
  if (msg.includes("trimester")) {
    return { type: "template", template: `pregnancy_trimester_${getTrimester(week)}` };
  }

  /* =========================
     🥗 FOOD CHECK
  ========================== */
  if (msg) {
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
        params: [String(food.details)]
      };
    }
  }

  return null;
};
