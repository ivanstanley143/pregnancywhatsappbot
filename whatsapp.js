const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");
const P = require("pino");

let sock;
let isConnecting = false;

async function connectToWhatsApp() {
  if (isConnecting) return sock;
  isConnecting = true;

  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" }),
    printQRInTerminal: true
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;

      console.log("⚠️ WhatsApp disconnected");

      if (shouldReconnect) {
        setTimeout(connectToWhatsApp, 30000);
      } else {
        console.log("❌ Logged out. Delete auth_info_baileys and re-scan QR");
      }
    }

    if (connection === "open") {
      console.log("✅ WhatsApp connected");
    }
  });

  isConnecting = false;
  return sock;
}

// 📩 Send text
async function sendTextMessage(number, text) {
  if (!sock) throw new Error("WhatsApp not connected");
  const jid = `${number}@s.whatsapp.net`;
  await sock.sendMessage(jid, { text });
}

// 🖼️ Send image
async function sendImageMessage(number, imageUrl, caption) {
  if (!sock) throw new Error("WhatsApp not connected");
  const jid = `${number}@s.whatsapp.net`;
  await sock.sendMessage(jid, {
    image: { url: imageUrl },
    caption
  });
}

module.exports = {
  connectToWhatsApp,
  sendTextMessage,
  sendImageMessage
};

