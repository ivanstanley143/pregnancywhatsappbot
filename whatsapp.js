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
      console.log("✅ Socket connected");

      if (!sock.authState.creds.registered) {
        const phoneNumber = process.env.WHATSAPP_NUMBER;

        if (!phoneNumber) {
          console.error("❌ WHATSAPP_NUMBER not set");
          process.exit(1);
        }

        const code = await sock.requestPairingCode(phoneNumber);
        console.log("📲 Pairing Code:", code);
      }
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;

      if (reason !== DisconnectReason.loggedOut) {
        console.log("🔁 Reconnecting...");
        connectToWhatsApp();
      } else {
        console.log("❌ Logged out. Delete auth folder & pair again.");
      }
    }
  });

  return sock;
}

module.exports = { connectToWhatsApp };
