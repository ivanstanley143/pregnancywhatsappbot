const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const pino = require("pino");

let isPairing = false;

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: "silent" }),
  });

  // 🔐 PAIRING CODE MODE (ONLY ONCE)
  if (!state.creds.registered && !isPairing) {
    isPairing = true;

    const phoneNumber = process.env.WHATSAPP_NUMBER;
    if (!phoneNumber) {
      throw new Error("❌ WHATSAPP_NUMBER not set in env");
    }

    const code = await sock.requestPairingCode(phoneNumber);
    console.log("📲 Pairing Code:", code);
    console.log("👉 Open WhatsApp → Linked Devices → Link with phone number");
  }

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("✅ WhatsApp connected successfully");
      isPairing = false;
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;

      if (reason === DisconnectReason.loggedOut) {
        console.log("❌ Logged out. Delete auth_info_baileys and pair again.");
        return;
      }

      // ⛔ DO NOT reconnect while pairing
      if (!isPairing) {
        console.log("🔁 Reconnecting...");
        setTimeout(connectToWhatsApp, 3000);
      }
    }
  });

  return sock;
}

module.exports = { connectToWhatsApp };
