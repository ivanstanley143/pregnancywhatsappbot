const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");
const P = require("pino");

let sock;

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("✅ WhatsApp connected");
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;

      console.log("⚠️ WhatsApp disconnected");

      if (shouldReconnect) {
        setTimeout(connectToWhatsApp, 30000);
      } else {
        console.log("❌ Logged out. Run pair.js again");
      }
    }
  });

  return sock;
}

// 📩 Text
async function sendTextMessage(number, text) {
  if (!sock) throw new Error("WhatsApp not connected");
  await sock.sendMessage(`${number}@s.whatsapp.net`, { text });
}

// 🖼 Image
async function sendImageMessage(number, imageUrl, caption) {
  if (!sock) throw new Error("WhatsApp not connected");
  await sock.sendMessage(`${number}@s.whatsapp.net`, {
    image: { url: imageUrl },
    caption
  });
}

module.exports = {
  connectToWhatsApp,
  sendTextMessage,
  sendImageMessage
};
