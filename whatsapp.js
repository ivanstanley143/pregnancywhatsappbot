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

    // ✅ SHOW QR
    if (qr) {
      console.log("📱 Scan this QR with WhatsApp");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("✅ WhatsApp connected");
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;

      // 🔐 FIRST LOGIN → DO NOT RECONNECT
      if (!state.creds.registered) {
        console.log("⏳ Waiting for QR scan...");
        return;
      }

      console.log("⚠️ WhatsApp disconnected");

      // 🔁 RECONNECT ONLY IF NOT LOGGED OUT
      if (statusCode !== DisconnectReason.loggedOut) {
        setTimeout(() => {
          isConnecting = false;
          connectToWhatsApp();
        }, 30000);
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
