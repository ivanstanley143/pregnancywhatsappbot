const {
  default: makeWASocket,
  useSingleFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const path = require("path");

// 🔴 SINGLE AUTH FILE
const { state, saveState } = useSingleFileAuthState(
  path.join(__dirname, "auth_info.json")
);

// 🔴 GLOBAL SOCKET (IMPORTANT)
let sock = null;

async function connectToWhatsApp() {
  if (sock) {
    console.log("♻️ Reusing existing WhatsApp socket");
    return sock;
  }

  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    browser: ["PregnancyBot", "Chrome", "1.0"]
  });

  sock.ev.on("creds.update", saveState);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("✅ WhatsApp socket OPEN");
    }

    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;
      console.log("⚠️ Connection closed:", code);

      if (code !== DisconnectReason.loggedOut) {
        sock = null;
        connectToWhatsApp();
      } else {
        console.log("❌ Logged out. Scan QR again.");
        sock = null;
      }
    }
  });

  return sock;
}

function getSocket() {
  return sock;
}

// 🔹 SEND TEXT
async function sendTextMessage(phone, text) {
  if (!sock) throw new Error("Socket not ready");

  await sock.sendMessage(`${phone}@s.whatsapp.net`, { text });
}

// 🔹 SEND IMAGE
async function sendImageMessage(phone, imageUrl, caption = "") {
  if (!sock) throw new Error("Socket not ready");

  await sock.sendMessage(`${phone}@s.whatsapp.net`, {
    image: { url: imageUrl },
    caption
  });
}

module.exports = {
  connectToWhatsApp,
  getSocket,
  sendTextMessage,
  sendImageMessage
};
