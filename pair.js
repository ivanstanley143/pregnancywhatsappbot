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

  // ⚠️ WAIT until socket is ready
  await new Promise((resolve) => setTimeout(resolve, 4000));

  if (!state.creds.registered) {
    const number = process.argv[2];

    if (!number) {
      console.log("❌ Usage: node pair.js 9198XXXXXXXX");
      process.exit(1);
    }

    const code = await sock.requestPairingCode(number);
    console.log("\n🔐 PAIRING CODE:", code);
    console.log("👉 WhatsApp → Linked Devices → Link a device → Enter code\n");
  }
}

pair();
