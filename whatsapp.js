const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const pino = require("pino");

async function connectToWhatsApp() {
  // Load auth state
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false, // ❌ QR disabled (pairing code only)
  });

  // 🔐 PAIRING CODE MODE (FORCED)
  const phoneNumber = process.env.WHATSAPP_NUMBER;

  if (!phoneNumber) {
    throw new Error("❌ WHATSAPP_NUMBER not set in environment");
  }

  if (!state.creds.registered) {
    console.log("🔐 Requesting pairing code...");
    const code = await sock.requestPairingCode(phoneNumber);
    console.log("📲 Pairing Code:", code);
  }

  // Save auth credentials
  sock.ev.on("creds.update", saveCreds);

  // Connection status
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("✅ WhatsApp connected successfully");
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;

      if (reason !== DisconnectReason.loggedOut) {
        console.log("🔁 Reconnecting WhatsApp...");
        connectToWhatsApp();
      } else {
        console.log("❌ Logged out. Delete auth_info_baileys and pair again.");
      }
    }
  });

  return sock;
}

module.exports = { connectToWhatsApp };
