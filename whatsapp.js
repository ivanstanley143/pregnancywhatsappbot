const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const Pino = require("pino");
const fs = require("fs");

let sock;

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    auth: state,
    logger: Pino({ level: "silent" }),
    browser: ["Pregnancy Bot", "Chrome", "1.0"],
  });

  // 🔐 PAIRING CODE METHOD
  if (!sock.authState.creds.registered) {
    const phoneNumber = process.env.PAIRING_NUMBER; // with country code
    const code = await sock.requestPairingCode(phoneNumber);
    console.log("🔐 Pairing Code:", code);
    console.log("👉 Enter this in WhatsApp → Linked Devices → Link a device");
  }

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("✅ WhatsApp connected successfully");
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;

      if (reason === DisconnectReason.loggedOut) {
        console.log("❌ Logged out. Delete auth_info_baileys and pair again.");
        fs.rmSync("auth_info_baileys", { recursive: true, force: true });
      } else {
        console.log("⚠️ Connection closed. Reconnecting...");
        connectToWhatsApp();
      }
    }
  });

  return sock;
}

function getSock() {
  if (!sock) throw new Error("WhatsApp not connected yet");
  return sock;
}

module.exports = {
  connectToWhatsApp,
  getSock,
};
