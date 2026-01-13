const axios = require("axios");

const TOKEN = process.env.META_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

const URL = `https://graph.facebook.com/v24.0/${PHONE_NUMBER_ID}/messages`;

function clean(text) {
  return String(text).replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
}

async function sendTemplate(to, name, body = [], image = null) {
  const components = [];

  if (image) {
    components.push({
      type: "header",
      parameters: [
        { type: "image", image: { link: image } }
      ]
    });
  }

  if (body.length) {
    components.push({
      type: "body",
      parameters: body.map(t => ({
        type: "text",
        text: clean(t)
      }))
    });
  }

  await axios.post(URL, {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name,
      language: { code: "en" },
      components
    }
  }, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    }
  });
}

module.exports = { sendTemplate };
