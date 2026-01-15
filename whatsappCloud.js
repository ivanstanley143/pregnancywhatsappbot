const axios = require("axios");

async function sendTemplate(to, template) {
  try {
    let components = [];

    // 👇 IMPORTANT: image required for pregnancy_dua
    if (template === "pregnancy_dua") {
      components.push({
        type: "header",
        parameters: [
          {
            type: "image",
            image: {
              link: "https://res.cloudinary.com/drcqtmobe/image/upload/v1768457852/517965945_10227891801024733_1699566531759542400_n_1_ttdeai.jpg"
            }
          }
        ]
      });
    }

    await axios.post(
      `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: template,
          language: { code: "en" },
          components
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.META_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Sent:", template);
  } catch (err) {
    console.error("❌ WhatsApp send failed:", err.response?.data || err.message);
  }
}

module.exports = { sendTemplate };
