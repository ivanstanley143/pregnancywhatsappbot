const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const path = require("path");
const fs = require("fs");

// 🔴 AUTH FOLDER (Baileys requirement now)
const AUTH_DIR = path.join(__dirname, "baileys_auth");

let sock = null;

async function connectToWhatsApp() {
  if (sock) {
    console.log("♻️ Reusing existing WhatsApp socket");
    return sock;
  }

  // Ensure auth folder exists
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR);
  }

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    browser: ["PregnancyBot", "Chrome", "1.0"]
  });

  sock.ev.on("creds.update", saveCreds);

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

async function sendTextMessage(phone, text) {
  if (!sock) throw new Error("Socket not ready");
  await sock.sendMessage(`${phone}@s.whatsapp.net`, { text });
}

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
