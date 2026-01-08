module.exports = {
  NAME: "Murshida Sulthana",
  DISCLAIMER: "Follow Ziyadka’s Advice",

  DOB: "1993-06-24",
  LMP: "2025-10-18",

  USER: "919074616114",
  HUSBAND: "918921285711",

  // Lists used for commands (safe foods / avoid foods / limit foods)
  SAFE_FOODS: [
    "Apple",
    "Banana",
    "Orange",
    "Grapes",
    "Pomegranate",
    "Avocado",
    "Mango",
    "Pear",
    "Watermelon",
    "Carrot",
    "Beetroot",
    "Spinach",
    "Broccoli",
    "Pumpkin",
    "Sweet potato",
    "Rice",
    "Chapati",
    "Oats",
    "Milk",
    "Curd",
    "Paneer",
    "Egg (well cooked)",
    "Chicken (well cooked)",
    "Fish (low mercury)"
  ],

  AVOID_FOODS: [
    "Papaya",
    "Pineapple",
    "Raw egg",
    "Raw fish",
    "Raw meat",
    "Alcohol",
    "Smoking",
    "Energy drink",
    "Unpasteurized milk",
    "Soft cheese",
    "Street food"
  ],

  LIMIT_FOODS: [
    "Coffee",
    "Tea",
    "Chocolate",
    "Fried food",
    "Junk food",
    "Salt",
    "Sugar"
  ],

  MEAL_TIMES: ["09:00","11:00","14:00","17:00","19:30","21:30"],
  WATER_TIMES: ["07:30","09:30","11:30","13:30","15:30","17:30","19:30","21:00"],

  // Database used for single-word food replies
  FOOD_DB: {
    // 🟢 SAFE FOODS
    apple: "✅ Safe – rich in fiber and vitamins",
    banana: "✅ Safe – good for digestion and energy",
    orange: "✅ Safe – vitamin C rich",
    grapes: "✅ Safe – antioxidants (wash well)",
    pomegranate: "✅ Safe – improves hemoglobin",
    avocado: "✅ Safe – healthy fats",
    mango: "✅ Safe – vitamin A (in moderation)",
    pear: "✅ Safe – fiber rich",
    watermelon: "✅ Safe – hydration",
    carrot: "✅ Safe – beta carotene",
    beetroot: "✅ Safe – supports blood levels",
    spinach: "✅ Safe – iron & folate",
    broccoli: "✅ Safe – calcium & fiber",
    pumpkin: "✅ Safe – vitamins",
    sweetpotato: "✅ Safe – energy & fiber",
    rice: "✅ Safe – easy to digest",
    chapati: "✅ Safe – whole grain energy",
    oats: "✅ Safe – fiber rich",
    milk: "✅ Safe – calcium source (boiled)",
    curd: "✅ Safe – probiotics",
    paneer: "✅ Safe – protein source",
    egg: "✅ Safe – protein (well cooked)",
    chicken: "✅ Safe – protein (well cooked)",
    fish: "✅ Safe – omega-3 (low mercury, well cooked)",

    // 🔴 AVOID FOODS
    papaya: "❌ Avoid – may trigger uterine contractions",
    pineapple: "❌ Avoid – contains bromelain",
    rawegg: "❌ Avoid – salmonella risk",
    rawfish: "❌ Avoid – infection risk",
    rawmeat: "❌ Avoid – harmful bacteria",
    alcohol: "❌ Avoid – harms baby development",
    smoking: "❌ Avoid – serious pregnancy risk",
    energydrink: "❌ Avoid – high caffeine",
    unpasteurizedmilk: "❌ Avoid – listeria risk",
    softcheese: "❌ Avoid – bacterial risk",
    streetfood: "❌ Avoid – hygiene issues",

    // 🟡 LIMIT FOODS
    coffee: "⚠️ Limit – caffeine intake",
    tea: "⚠️ Limit – caffeine",
    chocolate: "⚠️ Limit – sugar & caffeine",
    friedfood: "⚠️ Limit – digestion issues",
    junkfood: "⚠️ Limit – low nutrition",
    salt: "⚠️ Limit – swelling risk",
    sugar: "⚠️ Limit – gestational diabetes risk"
  },

  // Images for list commands
  SAFE_FOOD_IMAGE:
    "https://raw.githubusercontent.com/ivanstanley143/pregnancy-wa-bot/main/images/file_000000003b5c7207b2003e19bea0cbed.png",

  AVOID_FOOD_IMAGE:
    "https://raw.githubusercontent.com/ivanstanley143/pregnancy-wa-bot/main/images/file_0000000083a47207af592c9b4c3d45c0.png",

  LIMIT_FOOD_IMAGE:
    "https://res.cloudinary.com/drcqtmobe/image/upload/v1767795305/file_000000002d907207a5b1cf1c9165aa80_ina15s.png",

  BABY_IMAGES: {
    11: {
      size: "Fig 🫐",
      image: "https://raw.githubusercontent.com/ivanstanley143/pregnancy-wa-bot/main/images/file_00000000d12872079d38e6877ebf8d82.png"
    },
    12: {
      size: "Lime 🍋",
      image: "https://raw.githubusercontent.com/ivanstanley143/pregnancy-wa-bot/main/images/file_000000002f447207bffe5ab6c0f843fc.png"
    },
    13: {
      size: "Peach 🍑",
      image: "https://res.cloudinary.com/drcqtmobe/image/upload/v1767795308/file_0000000075ec72069b52c6d13eb158cd_tzyhn9.png"
    },
    14: {
      size: "Lemon 🍋",
      image: "https://res.cloudinary.com/drcqtmobe/image/upload/v1767795301/file_00000000ae207206a91304441fc049cc_pwlqay.png"
    },
    15: {
      size: "Apple 🍎",
      image: "https://res.cloudinary.com/drcqtmobe/image/upload/v1767795302/file_00000000a2487206b0277bcf6ef2757e_pevfay.png"
    }
  },

  TRIMESTER_IMAGES: {
    1: "https://raw.githubusercontent.com/ivanstanley143/pregnancy-wa-bot/main/images/file_00000000a9c47209958c868a7d4aaa1e.png",
    2: "https://raw.githubusercontent.com/ivanstanley143/pregnancy-wa-bot/main/images/file_00000000fc48720685063f2cf441d60a.png",
    3: "https://raw.githubusercontent.com/ivanstanley143/pregnancy-wa-bot/main/images/file_0000000013c0720681789ce45f4f039f.png"
  },

  WEEKLY_DUA: {
    12: "🤲 Rabbi habli min ladunka dhurriyyatan tayyibah / رَبِّ هَبْ لِي مِنْ لَدُنْكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ",
    13: "🤲 Allahumma yassir wala tu’assir wa tammim bil-khayr / رَبِّ يَسِّرْ وَلاَ تُعَسِّرْ وَتَمِّمْ بِالْخَيْرِ",
    14: "🤲 Rabbi zidni sihhat wa quwwah / رَبِّ زِدْنِي صِحَّةً وَقُوَّةً"
  },

  APPOINTMENTS: [
    { date: "2026-01-10", time: "10:00", note: "Doctor appointment" }
  ]
};
