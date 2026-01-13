const axios = require("axios");

const TOKEN = process.env.META_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

const URL = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;

function clean(text) {
  return String(text)
    .replace(/\r?\n/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

async function sendTemplate(to, name, params = []) {
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name,
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: params.map(p => ({
            type: "text",
            text: clean(p)
          }))
        }
      ]
    }
  };

  try {
    await axios.post(URL, payload, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    console.log(`✅ Sent ${name} to ${to}`);
  } catch (err) {
    console.error("❌ WhatsApp send failed");
    console.error("Template:", name);
    console.error("Phone:", to);
    console.error("Meta:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { sendTemplate };
