const axios = require("axios");

const TOKEN = process.env.META_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

async function sendTextMessage(to, text) {
  return axios.post(
    `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text }
    },
    {
      headers: { Authorization: `Bearer ${TOKEN}` }
    }
  );
}

async function sendImageMessage(to, imageUrl, caption) {
  return axios.post(
    `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "image",
      image: {
        link: imageUrl,
        caption
      }
    },
    {
      headers: { Authorization: `Bearer ${TOKEN}` }
    }
  );
}

async function sendTemplate(to, name, params = []) {
  return axios.post(
    `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name,
        language: { code: "en_US" },
        components: [
          {
            type: "body",
            parameters: params.map(p => ({ type: "text", text: p }))
          }
        ]
      }
    },
    {
      headers: { Authorization: `Bearer ${TOKEN}` }
    }
  );
}

module.exports = {
  sendTextMessage,
  sendImageMessage,
  sendTemplate
};

