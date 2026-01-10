const {
  default: makeWASocket,
  useMultiFileAuthState
} = require("@whiskeysockets/baileys");
const P = require("pino");

async function pair() {
  const number = process.argv[2];
  if (!number) {
    console.log("❌ Usage: node pair.js 66967242937");
    process.exit(1);
  }

  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  // ⏳ WAIT FOR SOCKET TO BE READY
  sock.ev.on("connection.update", async (u) => {
    if (u.connection === "open") {
      console.log("✅ Socket ready, requesting pairing code...");
      const code = await sock.requestPairingCode(number);
      console.log("🔐 PAIRING CODE:", code);
      console.log("👉 WhatsApp → Linked Devices → Enter code");
    }
  });
}

pair();
