const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const P = require("pino");
const path = require("path");

let sock;
let isConnected = false;

// 🔐 Auth folder
const AUTH_DIR = path.join(__dirname, "auth_info_baileys_v3");

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

  sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" }),
    browser: ["Pregnancy Bot", "Chrome", "1.0"]
  });

  // 💾 Save credentials
  sock.ev.on("creds.update", saveCreds);

  // 🔌 Connection handler (SAFE)
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("📱 Scan the QR code from WhatsApp → Linked devices");
    }

    if (connection === "open") {
      isConnected = true;
      console.log("✅ WhatsApp socket OPEN");
    }

    if (connection === "close") {
      isConnected = false;

      const statusCode =
        lastDisconnect?.error?.output?.statusCode;

      console.log("❌ WhatsApp connection closed:", statusCode);

      // 🛑 CRITICAL: Do NOT auto-reconnect on 405
      if (statusCode === 405) {
        console.log("🛑 WhatsApp blocked this session (405).");
        console.log("👉 Delete auth folder and scan QR again.");
        process.exit(1);
      }

      // ❌ No auto reconnect (prevents ban)
      process.exit(1);
    }
  });

  return sock;
}

// 📩 Send text message
async function sendTextMessage(to, text) {
  if (!isConnected) {
    console.warn("⚠️ WhatsApp not connected. Message skipped.");
    return;
  }

  await sock.sendMessage(to, { text });
}

// 🖼️ Send image message
async function sendImageMessage(to, imageUrl, caption = "") {
  if (!isConnected) {
    console.warn("⚠️ WhatsApp not connected. Image skipped.");
    return;
  }

  await sock.sendMessage(to, {
    image: { url: imageUrl },
    caption
  });
}

// 🔍 Connection status (used by scheduler)
function getConnectionStatus() {
  return isConnected;
}

module.exports = {
  connectToWhatsApp,
  sendTextMessage,
  sendImageMessage,
  getConnectionStatus
};
