const {
  default: makeWASocket,
  useMultiFileAuthState
} = require("@whiskeysockets/baileys");
const P = require("pino");

const number = process.argv[2];
if (!number) {
  console.log("❌ Usage: node pair.js 66XXXXXXXXX");
  process.exit(1);
}

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function pair() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" }),
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection } = update;

    if (connection === "open") {
      console.log("✅ WhatsApp socket OPEN");
      console.log("⏳ Waiting 5 seconds for stability...");

      await delay(5000); // 🔑 THIS FIXES 428 ERROR

      try {
        const code = await sock.requestPairingCode(number);
        console.log("🔐 PAIRING CODE:", code);
        console.log("👉 WhatsApp → Linked Devices → Enter code");
      } catch (err) {
        console.error("❌ Pairing failed:", err.message);
      }
    }
  });
}

pair();
