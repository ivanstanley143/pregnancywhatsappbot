const axios = require("axios");
const TEMPLATE_IMAGES = require("./templateImages");

async function sendTemplate(to, template, bodyParams = []) {
  try {
    const components = [];

    /* HEADER IMAGE */
    if (TEMPLATE_IMAGES[template]) {
      components.push({
        type: "header",
        parameters: [
          {
            type: "image",
            image: { link: TEMPLATE_IMAGES[template] }
          }
        ]
      });
    }

    /* BODY VARIABLES */
    if (Array.isArray(bodyParams) && bodyParams.length > 0) {
      components.push({
        type: "body",
        parameters: bodyParams.map(v => ({
          type: "text",
          text: String(v)
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
          language: { code: "en" }, // ✅ FIXED HERE
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

    console.log(`✅ Sent template: ${template}`);
  } catch (err) {
    console.error("❌ WhatsApp send failed:", template);
    console.error(err.response?.data || err.message);
  }
}

module.exports = { sendTemplate };
