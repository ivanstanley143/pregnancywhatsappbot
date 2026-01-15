const axios = require("axios");
const TEMPLATE_IMAGES = require("./templateImages");

async function sendTemplate(to, template) {
  try {
    let components = [];

    // Auto-attach IMAGE header if template has one
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

    console.log("✅ Sent:", template, "→", to);
  } catch (err) {
    console.error("❌ WhatsApp send failed");
    console.error("Template:", template);
    console.error(err.response?.data || err.message);
  }
}

module.exports = { sendTemplate };
