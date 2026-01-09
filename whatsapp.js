const makeWASocket = require("@whiskeysockets/baileys").default;
const {
  useMultiFileAuthState,
  DisconnectReason,
} = require("@whiskeysockets/baileys");

let sock = null;
let isConnected = false;

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false, // deprecated, we handle QR manually
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    // 🔑 Show QR in terminal (TEXT)
    if (qr) {
      console.log("📱 Scan this QR code from WhatsApp:");
      console.log(qr);
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

      if (statusCode !== DisconnectReason.loggedOut) {
        console.log("🔄 Reconnecting to WhatsApp...");
        connectToWhatsApp();
      } else {
        console.log("⚠️ Logged out from WhatsApp. Delete auth folder and re-scan QR.");
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

// 📤 Send text message
async function sendTextMessage(to, text) {
  if (!sock || !isConnected) {
    throw new Error("WhatsApp not connected");
  }

  await sock.sendMessage(`${to}@s.whatsapp.net`, {
    text,
  });
}

// 🖼️ Send image message
async function sendImageMessage(to, imageUrl, caption) {
  if (!sock || !isConnected) {
    throw new Error("WhatsApp not connected");
  }

  await sock.sendMessage(`${to}@s.whatsapp.net`, {
    image: { url: imageUrl },
    caption,
  });
}

// 🔌 Connection status
function getConnectionStatus() {
  return isConnected;
}

module.exports = {
  connectToWhatsApp,
  sendTextMessage,
  sendImageMessage,
  getConnectionStatus,
};
