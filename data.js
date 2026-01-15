module.exports = {
  NAME: "Murshida Sulthana",
  USER: "918921285711",
  LMP: "2025-10-18",
  FOOTER: "Follow Ziyadka’s Advice",
  TIMEZONE: "Asia/Kolkata",

  // 💧 Water reminder times
  WATER_TIMES: [
    "07:30","09:30","11:30","13:30",
    "15:30","17:30","19:30","21:00","22:30"
  ],

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
    12: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ Rabbana hab lana min azwajina wa dhurriyyatina qurrata a’yunin",
    13: "رَبِّي يَسِّرْ وَلَا تُعَسِّرْ Rabbi yassir wala tu’assir",
    14: "اللَّهُمَّ احْفَظْ وَلَدَنَا Allahumma ihfaz waladana",
    15: "رَبِّي تَمِّمْ بِالْخَيْرِ Rabbi tammim bil khair"
  },

  // 🍎 Food safety database (SOURCE OF TRUTH)
  FOOD_DB: {
    // ✅ SAFE FOODS
    apple: { label: "Apple 🍎", status: "SAFE", details: "Rich in fiber, vitamins and antioxidants. Helps digestion." },
    banana: { label: "Banana 🍌", status: "SAFE", details: "Good source of energy and potassium. Helps reduce nausea." },
    orange: { label: "Orange 🍊", status: "SAFE", details: "High in Vitamin C. Boosts immunity and iron absorption." },
    grapes: { label: "Grapes 🍇", status: "SAFE", details: "Contains antioxidants. Wash well before eating." },
    pomegranate: { label: "Pomegranate 🍎", status: "SAFE", details: "Improves hemoglobin and supports blood health." },
    avocado: { label: "Avocado 🥑", status: "SAFE", details: "Healthy fats. Supports baby’s brain development." },
    mango: { label: "Mango 🥭", status: "SAFE", details: "Vitamin A rich. Eat in moderation." },
    pear: { label: "Pear 🍐", status: "SAFE", details: "Fiber rich. Prevents constipation." },
    watermelon: { label: "Watermelon 🍉", status: "SAFE", details: "Helps hydration and reduces swelling." },

    carrot: { label: "Carrot 🥕", status: "SAFE", details: "Rich in beta-carotene. Good for vision." },
    beetroot: { label: "Beetroot 🍠", status: "SAFE", details: "Supports blood circulation and hemoglobin." },
    spinach: { label: "Spinach 🥬", status: "SAFE", details: "High in iron and folate. Prevents anemia." },
    broccoli: { label: "Broccoli 🥦", status: "SAFE", details: "Calcium and fiber rich. Strengthens bones." },
    pumpkin: { label: "Pumpkin 🎃", status: "SAFE", details: "Vitamin rich. Supports immunity." },
    sweetpotato: { label: "Sweet Potato 🍠", status: "SAFE", details: "Energy rich and good fiber source." },

    rice: { label: "Rice 🍚", status: "SAFE", details: "Easy to digest and good energy source." },
    chapati: { label: "Chapati 🫓", status: "SAFE", details: "Whole-grain energy source." },
    oats: { label: "Oats 🌾", status: "SAFE", details: "High fiber. Helps control sugar levels." },

    milk: { label: "Milk 🥛", status: "SAFE", details: "Excellent calcium source. Consume boiled milk." },
    curd: { label: "Curd 🥣", status: "SAFE", details: "Probiotics. Good for digestion." },
    paneer: { label: "Paneer 🧀", status: "SAFE", details: "High protein and calcium." },
    egg: { label: "Egg 🥚", status: "SAFE", details: "High-quality protein. Must be well cooked." },
    chicken: { label: "Chicken 🍗", status: "SAFE", details: "Lean protein. Always well cooked." },
    fish: { label: "Fish 🐟", status: "SAFE", details: "Omega-3 fatty acids. Choose low-mercury fish." },

    sapodilla: {
      label: "Sapodilla 🧆",
      status: "SAFE",
      details: "High fiber, vitamins A, C, B6, folate, iron and calcium. Reduces acidity and nausea."
    },

    // ⚠️ LIMIT FOODS
    coffee: { label: "Coffee ☕", status: "LIMIT", details: "High caffeine. Limit to one cup per day." },
    tea: { label: "Tea 🍵", status: "LIMIT", details: "Contains caffeine. Avoid excess intake." },
    chocolate: { label: "Chocolate 🍫", status: "LIMIT", details: "High sugar and caffeine. Eat occasionally." },
    friedfood: { label: "Fried Food 🍟", status: "LIMIT", details: "Hard to digest and may cause acidity." },
    junkfood: { label: "Junk Food 🍔", status: "LIMIT", details: "Low nutrition. Avoid frequent consumption." },
    salt: { label: "Salt 🧂", status: "LIMIT", details: "Excess may cause swelling." },
    sugar: { label: "Sugar 🍬", status: "LIMIT", details: "Increases gestational diabetes risk." },

    // 🚫 AVOID FOODS
    papaya: { label: "Papaya ❌", status: "AVOID", details: "May trigger uterine contractions." },
    pineapple: { label: "Pineapple ❌", status: "AVOID", details: "Contains bromelain. Not safe in pregnancy." },
    rawegg: { label: "Raw Egg ❌", status: "AVOID", details: "Risk of salmonella infection." },
    rawfish: { label: "Raw Fish ❌", status: "AVOID", details: "High infection risk." },
    rawmeat: { label: "Raw Meat ❌", status: "AVOID", details: "May contain harmful bacteria." },
    alcohol: { label: "Alcohol 🍺❌", status: "AVOID", details: "Harms baby brain development." },
    smoking: { label: "Smoking 🚬❌", status: "AVOID", details: "High risk of miscarriage and low birth weight." },
    energydrink: { label: "Energy Drink ❌", status: "AVOID", details: "Very high caffeine and chemicals." },
    unpasteurizedmilk: { label: "Unpasteurized Milk ❌", status: "AVOID", details: "Listeria infection risk." },
    softcheese: { label: "Soft Cheese ❌", status: "AVOID", details: "May contain harmful bacteria." }
  }
};
