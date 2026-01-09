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

  let pairingRequested = false;

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("✅ WhatsApp connected");
      return;
    }

    if (
      !state.creds.registered &&
      !pairingRequested &&
      connection === "connecting"
    ) {
      pairingRequested = true;

      try {
        const phone = process.env.WHATSAPP_NUMBER;
        const code = await sock.requestPairingCode(phone);
        console.log("📲 PAIRING CODE:", code);
      } catch (err) {
        console.error("❌ Pairing failed:", err.message);
      }
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;

      if (reason !== DisconnectReason.loggedOut) {
        console.log("🔁 Reconnecting...");
        connectToWhatsApp();
      } else {
        console.log("❌ Logged out. Delete auth folder & retry.");
      }
    }
  });

  return sock;
}

module.exports = { connectToWhatsApp };
