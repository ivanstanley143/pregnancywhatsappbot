const axios = require("axios");
const TEMPLATE_IMAGES = require("./templateImages");

/**
 * Send WhatsApp template message
 */
async function sendTemplate(to, template, bodyParams = [], lang = "en_US") {
  try {
    const components = [];

    /* =========================
       🖼️ HEADER IMAGE (ONLY IF TEMPLATE HAS HEADER IMAGE)
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
       🧾 BODY PARAMETERS (MUST MATCH TEMPLATE)
    ========================== */
    if (Array.isArray(bodyParams)) {
      components.push({
        type: "body",
        parameters: bodyParams.map(value => ({
          type: "text",
          text: String(value)
        }))
      });
    }

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: template,
        language: { code: lang },
        components
      }
    };

    const res = await axios.post(
      `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.META_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(`✅ Sent template: ${template} [${lang}]`, res.data);

  } catch (err) {
    console.error("❌ WhatsApp send failed:", template);
    console.error(err.response?.data || err.message);
  }
}

module.exports = { sendTemplate };
