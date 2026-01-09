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
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("✅ WhatsApp connected");
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;

      if (reason !== DisconnectReason.loggedOut) {
        console.log("🔁 Reconnecting...");
        connectToWhatsApp();
      } else {
        console.log("❌ Logged out. Delete auth folder and re-pair.");
      }
    }

    // ✅ REQUEST PAIRING ONLY AFTER SOCKET IS READY
    if (!state.creds.registered && connection === "connecting") {
      const phone = process.env.WHATSAPP_NUMBER;
      if (!phone) throw new Error("WHATSAPP_NUMBER missing");

      try {
        const code = await sock.requestPairingCode(phone);
        console.log("📲 PAIRING CODE:", code);
      } catch (err) {
        console.error("❌ Pairing failed:", err.message);
      }
    }
  });

  return sock;
}

module.exports = { connectToWhatsApp };
