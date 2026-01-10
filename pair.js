require("dotenv").config();
const {
  default: makeWASocket,
  useMultiFileAuthState
} = require("@whiskeysockets/baileys");
const P = require("pino");

async function pair() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  if (!state.creds.registered) {
    const number = process.env.WHATSAPP_NUMBER;
    if (!number) {
      console.log("❌ WHATSAPP_NUMBER missing");
      process.exit(1);
    }

    const code = await sock.requestPairingCode(number);
    console.log("\n🔐 PAIRING CODE:", code);
    console.log("👉 WhatsApp → Linked Devices → Enter code\n");
  }

  sock.ev.on("connection.update", (u) => {
    if (u.connection === "open") {
      console.log("✅ WhatsApp paired successfully");
      process.exit(0);
    }
  });
}

pair();
