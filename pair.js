const {
  default: makeWASocket,
  useMultiFileAuthState
} = require("@whiskeysockets/baileys");
const P = require("pino");

async function pair() {
  const number = process.argv[2];
  if (!number) {
    console.log("❌ Usage: node pair.js 66XXXXXXXXX");
    process.exit(1);
  }

  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" }),
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  if (!state.creds.registered) {
    console.log("📱 Requesting pairing code...");
    const code = await sock.requestPairingCode(number);
    console.log("🔐 PAIRING CODE:", code);
    console.log("👉 WhatsApp → Linked Devices → Link a device → Enter code");
  }
}

pair().catch(err => {
  console.error("❌ Pairing failed:", err.message);
});
