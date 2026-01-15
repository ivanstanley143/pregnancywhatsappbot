const axios = require("axios");
const TEMPLATE_IMAGES = require("./templateImages");

async function sendTemplate(to, template, bodyParams = []) {
  try {
    let components = [];

    // 1️⃣ IMAGE HEADER (if template has image)
    if (TEMPLATE_IMAGES[template]) {
      components.push({
        type: "header",
        parameters: [
          {
            type: "image",
            image: {
              link: TEMPLATE_IMAGES[template]
            }
          }
        ]
      });
    }

    // 2️⃣ BODY PARAMETERS (VERY IMPORTANT)
    if (bodyParams.length > 0) {
      components.push({
        type: "body",
        parameters: bodyParams.map(value => ({
          type: "text",
          text: value
        }))
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
    console.error("❌ WhatsApp send failed:", template);
    console.error(err.response?.data || err.message);
  }
}

module.exports = { sendTemplate };
