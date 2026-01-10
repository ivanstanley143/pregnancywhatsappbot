const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");
const P = require("pino");
const qrcode = require("qrcode-terminal");

let sock;
let isConnecting = false;

async function connectToWhatsApp() {
  if (isConnecting) return sock;
  isConnecting = true;

  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    // ✅ EXPLICIT QR HANDLING
    if (qr) {
      console.log("📱 Scan this QR with WhatsApp");
      qrcode.generate(qr, { small: true });
    }

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
        console.log("❌ Logged out. Delete auth_info_baileys and re-scan QR");
      }
    }
  });

  isConnecting = false;
  return sock;
}

module.exports = {
  connectToWhatsApp
};
