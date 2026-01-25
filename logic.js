const data = require("./data");
const { getPregnancyWeek, getTrimester, getPregnancyMonth } = require("./utils");
const Reminder = require("./models/Reminder");
const { getTodayPrayerTimes } = require("./services/athaanService");

module.exports = async (text, from) => {
  const msg = String(text || "").toLowerCase().trim();
  const week = getPregnancyWeek();

  /* =========================   
     🧪 TEST ATHAAN COMMAND
     Command: test athaan
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
     Command: athaan | azaan
  ========================== */
  if (msg === "athaan" || msg === "azaan") {
    try {
      const times = await getTodayPrayerTimes();

      if (!times || !times.Fajr || !times.Dhuhr || !times.Asr || !times.Maghrib || !times.Isha) {
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

    if (!next) {
      return { type: "text", text: "🩺 No upcoming appointments." };
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
     🤲 DUA
  ========================== */
  if (msg.includes("dua")) {
    const duaText = data.WEEKLY_DUA[week] || "رَبِّي تَمِّمْ بِالْخَيْرِ Rabbi tammim bil khair";

    return {
      type: "template",
      template: "pregnancy_dua",
      params: [String(data.NAME), String(duaText)]
    };
  }

  /* =========================
     🤰 WEEK COMMAND
  ========================== */
  if (msg === "week" || msg.includes("baby")) {
    const baby = data.BABY_IMAGES[week];

    const weekTemplateMap = {
      12: "pregnancy_week_12",
      13: "pregnancy_week_13",
      14: "pregnancy_week_14_v1",
      15: "pregnancy_week_15"
    };

    const templateName = weekTemplateMap[week];

    if (!baby || !templateName) {
      return { type: "text", text: `Week ${week} coming soon.` };
    }

    return {
      type: "template",
      template: templateName,
      params: [String(data.NAME), String(baby.size), String(week)]
    };
  }

  /* =========================
     📅 MONTH COMMAND
     Command: month
  ========================== */
  if (msg === "month") {
    const month = getPregnancyMonth(week);

    return {
      type: "template",
      template: `pregnancy_month_${month}`,
      params: [
        String(data.NAME),
        String(month)
      ]
    };
  }

  /* =========================
     🩺 TRIMESTER
  ========================== */
  if (msg.includes("trimester")) {
    const tri = getTrimester(week);
    return { type: "template", template: `pregnancy_trimester_${tri}` };
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
