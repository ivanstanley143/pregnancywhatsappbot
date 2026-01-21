const axios = require("axios");
const TEMPLATE_IMAGES = require("./templateImages");

/**
 * Send WhatsApp template message
 * @param {string} to - User phone number
 * @param {string} template - Template name
 * @param {Array} bodyParams - Body parameters (indexed)
 * @param {string} lang - Template language (default: en)
 */
async function sendTemplate(to, template, bodyParams = [], lang = "en") {
  try {
    const components = [];

    /* =========================
       🖼️ HEADER IMAGE
    ========================== */
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

    /* =========================
       🧾 BODY PARAMETERS
    ========================== */
    if (Array.isArray(bodyParams) && bodyParams.length > 0) {
      components.push({
        type: "body",
        parameters: bodyParams.map(value => ({
          type: "text",
          text: String(value)
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
          language: { code: lang }, // ✅ FIX HERE
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

    console.log(`✅ Sent template: ${template} [${lang}]`);
  } catch (err) {
    console.error("❌ WhatsApp send failed:", template);
    console.error(err.response?.data || err.message);
  }
}

module.exports = { sendTemplate };
