const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");
const P = require("pino");
const readline = require("readline");

let sock;
let isConnecting = false;
let isConnected = false;

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
      isConnected = true;
      console.log("✅ WhatsApp connected");
    }

    if (connection === "close") {
      isConnected = false;
      const code = lastDisconnect?.error?.output?.statusCode;

      if (code !== DisconnectReason.loggedOut) {
        console.log("⚠️ WhatsApp disconnected, reconnecting in 30s...");
        setTimeout(() => {
          isConnecting = false;
          connectToWhatsApp();
        }, 30000);
      } else {
        console.log("❌ Logged out. Delete auth_info_baileys and re-pair");
      }
    }
  });

  // 🔐 FIRST-TIME PAIRING
  if (!state.creds.registered) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(
      "📱 Enter WhatsApp number with country code (eg 9190xxxxxxx): ",
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

// 📩 TEXT MESSAGE
async function sendTextMessage(number, text) {
  if (!sock || !isConnected) throw new Error("WhatsApp not connected");
  const jid = `${number}@s.whatsapp.net`;
  await sock.sendMessage(jid, { text });
}

// 🖼 IMAGE MESSAGE
async function sendImageMessage(number, imageUrl, caption) {
  if (!sock || !isConnected) throw new Error("WhatsApp not connected");
  const jid = `${number}@s.whatsapp.net`;
  await sock.sendMessage(jid, {
    image: { url: imageUrl },
    caption
  });
}

module.exports = {
  connectToWhatsApp,
  sendTextMessage,
  sendImageMessage
};
