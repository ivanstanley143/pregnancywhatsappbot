const { sendTemplate } = require("../whatsappCloud");
const data = require("../data");

async function sendDailyDua() {
  const dua = data.WEEKLY_DUA[data.CURRENT_WEEK];

  await sendTemplate(data.USER, "pregnancy_dua", [
    {
      type: "body",
      parameters: [
        { type: "text", text: dua.arabic },
        { type: "text", text: dua.english }
      ]
    }
  ]);
}

module.exports = { sendDailyDua };
