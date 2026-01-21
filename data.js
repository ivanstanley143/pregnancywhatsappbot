module.exports = {
  NAME: "Murshida Sulthana",
  USER: "919074616114",
  LMP: "2025-10-18",
  FOOTER: "Follow Ziyadka’s Advice",
  TIMEZONE: "Asia/Kolkata",

  // 💧 Water reminder times
  WATER_TIMES: [
    "07:30","09:00","09:45","11:30","13:30",
    "14:00","15:30","17:30","19:00","20:30","21:30","22:30","23:30"
  ],

  // 🍽️ Meals — SINGLE bilingual variable
  MEALS: {
    "09:00": "പ്രഭാതഭക്ഷണം – മുട്ട & ബ്രെഡ് (Breakfast – Egg & Bread)",
    "11:00": "ഇടക്കാല ലഘുഭക്ഷണം – പഴങ്ങൾ (Snack – Fruits)",
    "14:00": "ഉച്ചഭക്ഷണം – ചോറ് & കറി (Lunch – Rice & Curry)",
    "17:00": "സായാഹ്ന ലഘുഭക്ഷണം – ചായ & ബിസ്കറ്റ് (Evening Snack – Tea & Biscuit)",
    "19:00": "ലഘുഭക്ഷണം – പാൽ & പഴം (Light Food – Milk & Fruit)",
    "21:00": "രാത്രി ഭക്ഷണം – ചപ്പാത്തി & പച്ചക്കറി (Dinner – Chapati & Vegetables)"
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
    apple: { label: "Apple 🍎", status: "SAFE", details: "Apple 🍎 Safe ✅ - Rich in fiber, vitamins and antioxidants. Helps digestion." },
    banana: { label: "Banana 🍌", status: "SAFE", details: "Banana 🍌 Safe ✅ - Good source of energy and potassium. Helps reduce nausea." },
    orange: { label: "Orange 🍊", status: "SAFE", details: "Orange 🍊 Safe ✅ - High in Vitamin C. Boosts immunity and iron absorption." },
    grapes: { label: "Grapes 🍇", status: "SAFE", details: "Grapes 🍇 Safe ✅ - Contains antioxidants. Wash well before eating." },
    pomegranate: { label: "Pomegranate 🍎", status: "SAFE", details: "Pomegranate 🍎 Safe ✅ - Improves hemoglobin and supports blood health." },
    avocado: { label: "Avocado 🥑", status: "SAFE", details: "Avocado 🥑 Safe ✅ - Healthy fats. Supports baby’s brain development." },
    mango: { label: "Mango 🥭", status: "SAFE", details: "Mango 🥭 Safe ✅ - Vitamin A rich. Eat in moderation." },
    pear: { label: "Pear 🍐", status: "SAFE", details: "Pear 🍐 Safe ✅ - Fiber rich. Prevents constipation." },
    watermelon: { label: "Watermelon 🍉", status: "SAFE", details: "Watermelon 🍉 Safe ✅ - Helps hydration and reduces swelling." },

    carrot: { label: "Carrot 🥕", status: "SAFE", details: "Carrot 🥕 Safe ✅ - Rich in beta-carotene. Good for vision." },
    drumstick: { label: "Drumstick (Moringa) 🌿", status: "SAFE", details: "Cooked drumstick is safe during the second trimester when eaten as part of regular meals. Provides iron, calcium, fiber, and folate. Avoid raw leaves, moringa powder/supplements, root, or medicinal extracts." },
    beetroot: { label: "Beetroot 🍠", status: "SAFE", details: "Beetroot 🍠 Safe ✅ - Supports blood circulation and hemoglobin." },
    spinach: { label: "Spinach 🥬", status: "SAFE", details: "Spinach 🥬 Safe ✅ - High in iron and folate. Prevents anemia." },
    broccoli: { label: "Broccoli 🥦", status: "SAFE", details: "Broccoli 🥦 Safe ✅ - Calcium and fiber rich. Strengthens bones." },
    pumpkin: { label: "Pumpkin 🎃", status: "SAFE", details: "Pumpkin 🎃 Safe ✅ - Vitamin rich. Supports immunity." },
    sweetpotato: { label: "Sweet Potato 🍠", status: "SAFE", details: "Sweet Potato 🍠 Safe ✅ - Energy rich and good fiber source." },

    rice: { label: "Rice 🍚", status: "SAFE", details: "Rice 🍚 Safe ✅ - Easy to digest and good energy source." },
    chapati: { label: "Chapati 🫓", status: "SAFE", details: "Chapati 🫓 Safe ✅ - Whole-grain energy source." },
    oats: { label: "Oats 🌾", status: "SAFE", details: "Oats 🌾 Safe ✅ - High fiber. Helps control sugar levels." },
    Tendercoconut: { label: "Tender Coconut 🥥", status: "SAFE", details: "Tender Coconut 🥥 Safe ✅ - Provides natural electrolytes (potassium, sodium, magnesium). May help reduce risk of urinary tract infections. Amino acids & antioxidants. B-complex vitamins." },
    milk: { label: "Milk 🥛", status: "SAFE", details: "Milk 🥛 Safe ✅ - Excellent calcium source. Consume boiled milk." },
    curd: { label: "Curd 🥣", status: "SAFE", details: "Curd 🥣 Safe ✅ - Probiotics. Good for digestion." },
    paneer: { label: "Paneer 🧀", status: "SAFE", details: "Paneer 🧀 Safe ✅ - High protein and calcium." },
    egg: { label: "Egg 🥚", status: "SAFE", details: "Egg 🥚 Safe ✅ - High-quality protein. Must be well cooked." },
    chicken: { label: "Chicken 🍗", status: "SAFE", details: "Chicken 🍗 Safe ✅ - Lean protein. Always well cooked." },
    fish: { label: "Fish 🐟", status: "SAFE", details: "Fish 🐟 Safe ✅ - Omega-3 fatty acids. Choose low-mercury fish." },
    sapodilla: {label: "Sapodilla 🧆", status: "SAFE", details: "Sapodilla 🧆 Safe ✅ - High fiber, vitamins A, C, B6, folate, iron and calcium. Reduces acidity and nausea." },
    kiwi: { label: "Kiwi 🥝", status: "SAFE", details: "Kiwi 🥝 Safe ✅ - Rich in Vitamin C, fiber and folate. Helps digestion and boosts immunity." },
    strawberry: { label: "Strawberry 🍓", status: "SAFE", details: "Strawberry 🍓 Safe ✅ - High in antioxidants and Vitamin C. Supports baby’s growth." },
    blueberry: { label: "Blueberry 🫐", status: "SAFE", details: "Blueberry 🫐 Safe ✅ - Antioxidant rich. Supports brain development and immunity." },
    applegreen: { label: "Green Apple 🍏", status: "SAFE", details: "Green Apple 🍏 Safe ✅ - Helps digestion and controls nausea." },
    guava: { label: "Guava 🍈", status: "SAFE", details: "Guava 🍈 Safe ✅ - Very high Vitamin C and fiber. Prevents constipation." },
    plum: { label: "Plum 🍑", status: "SAFE", details: "Plum 🍑 Safe ✅ - Good for digestion and prevents constipation." },
    cucumber: { label: "Cucumber 🥒", status: "SAFE", details: "Cucumber 🥒 Safe ✅ - Keeps body hydrated and reduces swelling." },
    tomato: { label: "Tomato 🍅", status: "SAFE", details: "Tomato 🍅 Safe ✅ - Rich in Vitamin C and antioxidants." },
    capsicum: { label: "Capsicum 🫑", status: "SAFE", details: "Capsicum 🫑 Safe ✅ - High in Vitamin C. Supports immunity." },
    cauliflower: { label: "Cauliflower 🥦", status: "SAFE", details: "Cauliflower 🥦 Safe ✅ - Good source of fiber and Vitamin C." },
    cabbage: { label: "Cabbage 🥬", status: "SAFE", details: "Cabbage 🥬 Safe ✅ - Rich in fiber. Eat well-cooked to avoid gas." },
    ladiesfinger: { label: "Ladies Finger (Okra) 🌿", status: "SAFE", details: "Ladies Finger (Okra) 🌿 Safe ✅ - High fiber. Helps digestion and blood sugar control." },
    beans: { label: "Green Beans 🫘", status: "SAFE", details: "Green Beans 🫘 Safe ✅ - Good source of folate and fiber." },
    peas: { label: "Green Peas 🟢", status: "SAFE", details: "Green Peas 🟢 Safe ✅ - Protein and fiber rich. Supports baby growth." },
    cherry: { label: "Cherry 🍒", status: "SAFE", details: "Cherry 🍒 Safe ✅ - Contains antioxidants and anti-inflammatory properties." },

    // ⚠️ LIMIT FOODS
    papayaripe: { label: "Ripe Papaya 🍈", status: "LIMIT", details: "Ripe Papaya 🍈 Limit ⚠️ - Only fully ripe papaya in small amounts. Avoid in early pregnancy." },
    coffee: { label: "Coffee ☕", status: "LIMIT", details: "Coffee ☕ Limit ⚠️ - High caffeine. Limit to one cup per day." },
    tea: { label: "Tea 🍵", status: "LIMIT", details: "Tea 🍵 Limit ⚠️ - Contains caffeine. Avoid excess intake." },
    chocolate: { label: "Chocolate 🍫", status: "LIMIT", details: "Chocolate 🍫 Limit ⚠️ - High sugar and caffeine. Eat occasionally." },
    friedfood: { label: "Fried Food 🍟", status: "LIMIT", details: "Fried Food 🍟 Limit ⚠️ - Hard to digest and may cause acidity." },
    junkfood: { label: "Junk Food 🍔", status: "LIMIT", details: "Junk Food 🍔 Limit ⚠️ - Low nutrition. Avoid frequent consumption." },
    salt: { label: "Salt 🧂", status: "LIMIT", details: "Salt 🧂 Limit ⚠️ - Excess may cause swelling." },
    potato: { label: "Potato 🥔", status: "LIMIT", details: "Potato 🥔 Limit ⚠️ - High carbohydrate. Eat in moderation." },
    brinjal: { label: "Brinjal (Eggplant) 🍆", status: "LIMIT", details: "Brinjal (Eggplant) 🍆 Limit ⚠️ - May cause acidity in some women." },
    sugar: { label: "Sugar 🍬", status: "LIMIT", details: "Sugar 🍬 Limit ⚠️ - Increases gestational diabetes risk." },

    // 🚫 AVOID FOODS
    papaya: { label: "Papaya 🥭❌", status: "AVOID", details: "Papaya 🥭 Avoid ❌ - May trigger uterine contractions." },
    pineapple: { label: "Pineapple 🍍❌", status: "AVOID", details: "Pineapple 🍍 Avoid ❌ - Contains bromelain. Not safe in pregnancy." },
    rawegg: { label: "Raw Egg 🥚❌", status: "AVOID", details: "Raw Egg 🥚 Avoid ❌ - Risk of salmonella infection." },
    rawfish: { label: "Raw Fish 🐟❌", status: "AVOID", details: "Raw Fish 🐟 Avoid ❌ - High infection risk." },
    rawmeat: { label: "Raw Meat 🥩❌", status: "AVOID", details: "Raw Meat 🥩 Avoid ❌ - May contain harmful bacteria." },
    alcohol: { label: "Alcohol 🍺❌", status: "AVOID", details: "Alcohol 🍺 Avoid ❌ - Harms baby brain development." },
    smoking: { label: "Smoking 🚬❌", status: "AVOID", details: "Smoking 🚬 Avoid ❌ - High risk of miscarriage and low birth weight." },
    energydrink: { label: "Energy Drink 🥫⚡❌", status: "AVOID", details: "Energy Drink 🥫⚡ Avoid ❌ - Very high caffeine and chemicals." },
    rawsprouts: { label: "Raw Sprouts 🌱❌", status: "AVOID", details: "Raw Sprouts 🌱 Avoid ❌ - High risk of bacterial infection." },
    unpasteurizedmilk: { label: "Unpasteurized Milk 🐄🥛❌", status: "AVOID", details: "Unpasteurized Milk 🐄🥛 Avoid ❌ - Listeria infection risk." },
    softcheese: { label: "Soft Cheese 🧀❌", status: "AVOID", details: "Soft Cheese 🧀 Avoid ❌ - May contain harmful bacteria." }
  }
};
