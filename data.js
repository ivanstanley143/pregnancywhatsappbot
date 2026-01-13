module.exports = {
  NAME: "Murshida Sulthana",
  USER: "918921285711",
  LMP: "2025-10-18",
  FOOTER: "Follow Ziyadka’s Advice",
  TIMEZONE: "Asia/Kolkata",

  // 💧 Water reminder times
  WATER_TIMES: ["07:30","09:30","11:30","13:30","15:30","17:30","19:30","21:00"],

  // 🍽️ Meals — SINGLE bilingual variable
  MEALS: {
    "09:00": "പ്രഭാതഭക്ഷണം – മുട്ട & ബ്രെഡ് (Breakfast – Egg & Bread)",
    "11:00": "ഇടക്കാല ലഘുഭക്ഷണം – പഴങ്ങൾ (Snack – Fruits)",
    "14:00": "ഉച്ചഭക്ഷണം – ചോറ് & കറി (Lunch – Rice & Curry)",
    "17:00": "സായാഹ്ന ലഘുഭക്ഷണം – ചായ & ബിസ്കറ്റ് (Evening Snack – Tea & Biscuit)",
    "19:30": "രാത്രി ഭക്ഷണം – ചപ്പാത്തി & പച്ചക്കറി (Dinner – Chapati & Vegetables)",
    "21:30": "ലഘുഭക്ഷണം – പാൽ (Light Food – Milk)"
  },

  // 👶 Baby size per week
  BABY_IMAGES: {
    12: { size: "Lime 🍋" },
    13: { size: "Peach 🍑" },
    14: { size: "Lemon 🍋" },
    15: { size: "Apple 🍎" }
  },

  // 🤲 Weekly duas
  WEEKLY_DUA: {
    11: "رَبِّ زِدْنِي عِلْمًا – Rabbi zidni ilma",
    12: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ – Rabbana hab lana min azwajina wa dhurriyyatina qurrata a’yunin",
    13: "رَبِّي يَسِّرْ وَلَا تُعَسِّرْ – Rabbi yassir wala tu’assir",
    14: "اللَّهُمَّ احْفَظْ وَلَدَنَا – Allahumma ihfaz waladana",
    15: "رَبِّي تَمِّمْ بِالْخَيْرِ – Rabbi tammim bil khair"
  },

  // 🍎 Food safety database
  FOOD_DB: {
    apple: { label: "Apple 🍎", status: "SAFE", details: "Rich in fiber and vitamins" },
    banana: { label: "Banana 🍌", status: "SAFE", details: "Good for energy and nausea" },
    orange: { label: "Orange 🍊", status: "SAFE", details: "High vitamin C" },
    milk: { label: "Milk 🥛", status: "SAFE", details: "Calcium for bones" },
    egg: { label: "Egg 🥚", status: "SAFE", details: "High protein (well cooked)" },

    coffee: { label: "Coffee ☕", status: "LIMIT", details: "Limit caffeine" },
    tea: { label: "Tea 🍵", status: "LIMIT", details: "Contains caffeine" },
    sugar: { label: "Sugar 🍬", status: "LIMIT", details: "Too much increases diabetes risk" },

    papaya: { label: "Papaya ❌", status: "AVOID", details: "Can trigger contractions" },
    pineapple: { label: "Pineapple ❌", status: "AVOID", details: "Not safe" },
    alcohol: { label: "Alcohol ❌", status: "AVOID", details: "Harms baby brain" }
  }
};
