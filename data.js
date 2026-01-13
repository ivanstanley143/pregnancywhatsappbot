module.exports = {
  // 👩 Mother details
  NAME: "Murshida Sulthana",
  TIMEZONE: "Asia/Kolkata",
  FOOTER: "- Follow Ziyadka’s Advice",
  
  DOB: "1993-06-24",
  LMP: "2025-10-18",

  // 📱 WhatsApp numbers (without +)
  USER: "919074616114",
  HUSBAND: "918921285711",

  // ⏰ Daily reminder times
  MEAL_TIMES: ["09:00","11:00","14:00","17:00","19:30","21:30"],
  WATER_TIMES: ["07:30","09:30","11:30","13:30","15:30","17:30","19:30","21:00"],

  // 🍽️ Meal messages (English + Malayalam)
  MEALS: {
    "09:00": ["Breakfast 🍽️", "പ്രഭാതഭക്ഷണം 🍽️"],
    "11:00": ["Snack 🍎", "ഇടക്കാല ലഘുഭക്ഷണം 🍎"],
    "14:00": ["Lunch 🥗", "ഉച്ചഭക്ഷണം 🥗"],
    "17:00": ["Evening snack ☕", "സായാഹ്ന ലഘുഭക്ഷണം ☕"],
    "19:30": ["Dinner 🍽️", "രാത്രി ഭക്ഷണം 🍽️"],
    "21:30": ["Light food 🥛", "ലഘുഭക്ഷണം 🥛"]
  },

  // 🕊️ Daily dua reminder time
  DAILY_DUA_TIME: "06:30",

  // =======================
  // 🍎 MASTER FOOD DATABASE
  // =======================
  FOOD_DB: {
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
    chapati: { label: "Chapati 🫓", status: "SAFE", details: "Whole grain energy source." },
    oats: { label: "Oats 🌾", status: "SAFE", details: "High fiber. Helps control sugar levels." },
    milk: { label: "Milk 🥛", status: "SAFE", details: "Excellent calcium source. Consume boiled milk." },
    curd: { label: "Curd 🥣", status: "SAFE", details: "Probiotics. Good for digestion." },
    paneer: { label: "Paneer 🧀", status: "SAFE", details: "High protein and calcium." },
    egg: { label: "Egg 🥚", status: "SAFE", details: "High-quality protein. Must be well cooked." },
    chicken: { label: "Chicken 🍗", status: "SAFE", details: "Lean protein. Always well cooked." },
    fish: { label: "Fish 🐟", status: "SAFE", details: "Omega-3 fatty acids. Choose low-mercury fish." },

    coffee: { label: "Coffee ☕", status: "LIMIT", details: "High caffeine. Limit to one cup per day." },
    tea: { label: "Tea 🍵", status: "LIMIT", details: "Contains caffeine. Avoid excess intake." },
    chocolate: { label: "Chocolate 🍫", status: "LIMIT", details: "High sugar and caffeine. Eat occasionally." },
    friedfood: { label: "Fried Food 🍟", status: "LIMIT", details: "Hard to digest and may cause acidity." },
    junkfood: { label: "Junk Food 🍔", status: "LIMIT", details: "Low nutrition. Avoid frequent consumption." },
    salt: { label: "Salt 🧂", status: "LIMIT", details: "Excess may cause swelling." },
    sugar: { label: "Sugar 🍬", status: "LIMIT", details: "Increases gestational diabetes risk." },

    papaya: { label: "Papaya ❌", status: "AVOID", details: "May trigger uterine contractions." },
    pineapple: { label: "Pineapple ❌", status: "AVOID", details: "Contains bromelain. Not safe in pregnancy." },
    rawegg: { label: "Raw Egg ❌", status: "AVOID", details: "Risk of salmonella infection." },
    rawfish: { label: "Raw Fish ❌", status: "AVOID", details: "High infection risk." },
    rawmeat: { label: "Raw Meat ❌", status: "AVOID", details: "May contain harmful bacteria." },
    alcohol: { label: "Alcohol 🍺❌", status: "AVOID", details: "Harms baby brain development." },
    smoking: { label: "Smoking 🚬❌", status: "AVOID", details: "High risk of miscarriage and low birth weight." },
    energydrink: { label: "Energy Drink ❌", status: "AVOID", details: "Very high caffeine and chemicals." },
    unpasteurizedmilk: { label: "Unpasteurized Milk ❌", status: "AVOID", details: "Listeria infection risk." },
    softcheese: { label: "Soft Cheese ❌", status: "AVOID", details: "May contain harmful bacteria." },
    streetfood: { label: "Street Food ❌", status: "AVOID", details: "Poor hygiene. Infection risk." }
  },

  // 🖼️ Baby growth images
  BABY_IMAGES: {
    11: { size: "Fig 🫐", image: "https://raw.githubusercontent.com/ivanstanley143/pregnancy-wa-bot/main/images/file_00000000d12872079d38e6877ebf8d82.png" },
    12: { size: "Lime 🍋", image: "https://res.cloudinary.com/drcqtmobe/image/upload/v1767795308/file_0000000075ec72069b52c6d13eb158cd_tzyhn9.png" },
    13: { size: "Peach 🍑", image: "https://res.cloudinary.com/drcqtmobe/image/upload/v1767795308/file_0000000075ec72069b52c6d13eb158cd_tzyhn9.png" },
    14: { size: "Lemon 🍋", image: "https://res.cloudinary.com/drcqtmobe/image/upload/v1767795301/file_00000000ae207206a91304441fc049cc_pwlqay.png" },
    15: { size: "Apple 🍎", image: "https://res.cloudinary.com/drcqtmobe/image/upload/v1767795302/file_00000000a2487206b0277bcf6ef2757e_pevfay.png" }
  },

  TRIMESTER_IMAGES: {
    1: "https://res.cloudinary.com/drcqtmobe/image/upload/v1767795301/file_00000000a9c47209958c868a7d4aaa1e_pl4p3h.png",
    2: "https://res.cloudinary.com/drcqtmobe/image/upload/v1767795305/file_00000000fc48720685063f2cf441d60a_uisr2b.png",
    3: "https://res.cloudinary.com/drcqtmobe/image/upload/v1767795304/file_0000000013c0720681789ce45f4f039f_n32kqs.png"
  },

  WEEKLY_DUA: {
    12: "🤲 Rabbi habli min ladunka dhurriyyatan tayyibah",
    13: "🤲 Rabbi yassir wala tu’assir wa tammim bil-khayr",
    14: "🤲 Rabbi zidni sihhat wa quwwah"
  },

  APPOINTMENTS: [
    { date: "2026-01-12", time: "10:00", note: "Doctor appointment" }
  ]
};
