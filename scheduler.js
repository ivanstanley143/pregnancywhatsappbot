const cron = require("node-cron");
const { sendTextMessage, sendImageMessage, getConnectionStatus } = require("./whatsapp");
const data = require("./data");
const utils = require("./utils");

let LAST_WEEK = null;
let LAST_TRIMESTER = null;
let SENT_APPOINTMENTS = new Set();

const sendText = async (to, text) => {
  if (!getConnectionStatus()) {
    console.warn("⚠️ WhatsApp not connected. Skipping message.");
    return;
  }
  await sendTextMessage(to, text);
};

const sendImage = async (to, image, caption) => {
  if (!getConnectionStatus()) {
    console.warn("⚠️ WhatsApp not connected. Skipping message.");
    return;
  }
  await sendImageMessage(to, image, caption);
};

module.exports = () => {

  // 💧 Water
  data.WATER_TIMES.forEach(t => {
    cron.schedule(`${t.split(":")[1]} ${t.split(":")[0]} * * *`, async () => {
      await sendText(
        data.USER,
        utils.format("💧 Please drink water", "💧 ദയവായി വെള്ളം കുടിക്കൂ")
      );
    });
  });

  // 🍽 Meals with names
  const meals = {
    "09:00": ["🍽️ Breakfast time", "🍽️ പ്രഭാതഭക്ഷണ സമയം"],
    "12:00": ["🍎 Snack time", "🍎 ഇടക്കാല ലഘുഭക്ഷണം"],
    "15:00": ["🥗 Light meal time", "🥗 ലഘുഭക്ഷണ സമയം"],
    "18:00": ["☕ Evening snack time", "☕ സായാഹ്ന ലഘുഭക്ഷണം"],
    "19:30": ["🍽️ Dinner time", "🍽️ രാത്രി ഭക്ഷണം"],
    "21:30": ["🥛 Light food time", "🥛 പാൽ / ലഘുഭക്ഷണം"]
  };

  Object.keys(meals).forEach(t => {
    cron.schedule(`${t.split(":")[1]} ${t.split(":")[0]} * * *`, async () => {
      await sendText(data.USER, utils.format(meals[t][0], meals[t][1]));
    });
  });

  // 🌙 Weekly dua
  cron.schedule("0 9 * * 5", async () => {
    const { week } = utils.getPregnancy();
    if (data.WEEKLY_DUA[week]) {
      await sendText(
        data.USER,
        utils.format(
          `🌙 Weekly Dua\n${data.WEEKLY_DUA[week]}`,
          "🌙 ആഴ്ചയിലെ ദുആ"
        )
      );
    }
  });

  // 📅 Appointment
  cron.schedule("* * * * *", async () => {
    const now = utils.now();
    for (const a of data.APPOINTMENTS) {
      const appointmentKey = `${a.date}-${a.time}`;
      if (a.date === now.format("YYYY-MM-DD") &&
          a.time === now.format("HH:mm") &&
          !SENT_APPOINTMENTS.has(appointmentKey)) {
        const msg = utils.format(
          `📅 ${a.note}`,
          "📅 ഇന്ന് ഡോക്ടർ അപ്പോയിന്റ്മെന്റ്"
        );
        await sendText(data.USER, msg);
        await sendText(data.HUSBAND, msg);
        SENT_APPOINTMENTS.add(appointmentKey);
      }
    }
  });

  // 🤰 Trimester & baby growth
  cron.schedule("* * * * *", async () => {
    const { week } = utils.getPregnancy();
    const trimester = utils.getTrimester(week);

    if (trimester !== LAST_TRIMESTER) {
      const caption = utils.format(
        `🌸 Trimester ${trimester} started`,
        `🌸 ട്രൈമെസ്റ്റർ ${trimester} ആരംഭിച്ചു`
      );

      // USER gets trimester image
      await sendImage(
        data.USER,
        data.TRIMESTER_IMAGES[trimester],
        caption
      );

      // HUSBAND also gets trimester image (important update)
      await sendImage(
        data.HUSBAND,
        data.TRIMESTER_IMAGES[trimester],
        caption
      );

      LAST_TRIMESTER = trimester;
    }

    if (week !== LAST_WEEK && data.BABY_IMAGES[week]) {
      const b = data.BABY_IMAGES[week];
      const caption = utils.format(
        `🤰 Week ${week}\nBaby size: ${b.size}`,
        `🤰 ${week} ആഴ്ച\nകുഞ്ഞിന്റെ വലുപ്പം: ${b.size}`
      );

      // USER gets weekly baby growth image
      await sendImage(
        data.USER,
        b.image,
        caption
      );

      // HUSBAND also gets weekly baby growth image (important update)
      await sendImage(
        data.HUSBAND,
        b.image,
        caption
      );

      LAST_WEEK = week;
    }
  });
};
