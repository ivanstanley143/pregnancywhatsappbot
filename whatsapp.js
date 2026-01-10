const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");
const P = require("pino");
const readline = require("readline");

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

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("✅ WhatsApp connected");
    }

    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) {
        console.log("⚠️ WhatsApp disconnected, reconnecting...");
        setTimeout(() => {
          isConnecting = false;
          connectToWhatsApp();
        }, 30000);
      } else {
        console.log("❌ Logged out. Delete auth_info_baileys and re-pair");
      }
    }
  });

  // 🔐 FIRST-TIME PAIRING (RELIABLE ON VPS)
  if (!state.creds.registered) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(
      "📱 Enter WhatsApp number with country code (eg 9190xxxxxx): ",
      async (number) => {
        const code = await sock.requestPairingCode(number.trim());
        console.log("🔐 Pairing Code:", code);
        console.log("👉 WhatsApp → Linked Devices → Link a device → Enter code");
        rl.close();
      }
    );
  }

  isConnecting = false;
  return sock;
}

module.exports = { connectToWhatsApp };
