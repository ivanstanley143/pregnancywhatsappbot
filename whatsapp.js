const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const pino = require("pino");

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false, // ❌ NO QR
    logger: pino({ level: "silent" }),
  });

  // 🔐 PAIRING CODE MODE
  if (!sock.authState.creds.registered) {
    const phoneNumber = process.env.WHATSAPP_NUMBER; // 66XXXXXXXXXX
    const code = await sock.requestPairingCode(phoneNumber);
    console.log("📲 Pairing Code:", code);
  }

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;

      if (reason !== DisconnectReason.loggedOut) {
        console.log("🔁 Reconnecting...");
        connectToWhatsApp();
      } else {
        console.log("❌ Logged out. Delete auth folder & pair again.");
      }
    }

    if (connection === "open") {
      console.log("✅ WhatsApp connected successfully");
    }
  });

  return sock;
}

module.exports = { connectToWhatsApp };
