const axios = require("axios");

const TOKEN = process.env.META_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

const URL = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;

async function sendTemplate(to, name, components = []) {
  try {
    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name,
        language: { code: "en_US" },
        components
      }
    };

    await axios.post(URL, payload, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    console.log(`✅ Sent template: ${name} to ${to}`);
  } catch (err) {
    console.error("❌ WhatsApp send failed");
    console.error("Template:", name);
    console.error("Phone:", to);
    console.error("Meta error:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { sendTemplate };
